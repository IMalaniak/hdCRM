import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { Op } from 'sequelize';

import {
  BaseResponse,
  OrganizationCreationAttributes,
  UserCreationAttributes,
  Organization,
  Privilege,
  PasswordAttribute,
  UserAttributes,
  UserSession,
  User,
  PasswordReset
} from '../models';
import { CONSTANTS, MailThemes, UserState } from '../constants';
import { Config } from '../config';
import { Crypt } from '../utils/crypt';
import { Mailer } from '../mailer/nodeMailerTemplates';
import { JwtHelper } from '../helpers/jwtHelper';

@Service()
export class AuthService {
  constructor(private readonly crypt: Crypt, private readonly mailer: Mailer, private readonly jwtHelper: JwtHelper) {}

  public async register(params: {
    organization: OrganizationCreationAttributes;
    user: UserCreationAttributes;
    password: string;
  }): Promise<Result<BaseResponse, BaseResponse>> {
    // Logger.Info(`Registering new user...`);

    const { organization, user, password } = params;

    try {
      const createdOrg = await Organization.create(organization, {
        include: [{ association: Organization.associations.Roles }]
      });
      const createdUser = await createdOrg.createUser({
        ...user
      });

      const privileges = await Privilege.findAll();
      const adminRole = createdOrg.Roles[0];
      await adminRole.setPrivileges(privileges);
      await adminRole.getPrivileges().then((rPrivileges) => {
        rPrivileges.forEach((privilege) => {
          privilege.RolePrivilege.add = true;
          privilege.RolePrivilege.delete = true;
          privilege.RolePrivilege.edit = true;
          privilege.RolePrivilege.view = true;
          privilege.RolePrivilege.save();
        });
      });
      await adminRole.addUser(createdUser);

      const token = this.crypt.genTimeLimitedToken(24 * 60);
      await createdUser.createPasswordAttributes({
        token: token.value,
        tokenExpire: token.expireDate,
        passwordExpire: token.expireDate
      });

      await this.sendMail(MailThemes.Activation, {
        user: createdUser,
        tmpPassword: password,
        url: `${Config.WEB_URL}/auth/activate-account/${token.value}`
      });

      return ok({
        success: true,
        message: 'Activation link has been sent'
      });
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async activateAccount(token: string): Promise<Result<BaseResponse, BaseResponse>> {
    // Logger.Info(`Activating new user...`);

    try {
      const pa = await PasswordAttribute.findOne({
        where: {
          token,
          tokenExpire: {
            [Op.gt]: Date.now()
          }
        }
      });
      if (pa) {
        const user = await pa.getUser();
        user.state = UserState.ACTIVE;
        await user.save();
        pa.token = null;
        pa.tokenExpire = null;
        await pa.save();

        await this.sendMail(MailThemes.ActivationConfirm, user);
        return ok({
          success: true,
          message: 'You account has been activated successfully!'
        });
      } else {
        return err({
          success: false,
          message: 'Your activation token is invalid or has expired!'
        });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async authenticate(params: {
    loginOrEmail: string;
    password: string;
    connection: {
      IP: string;
      UA: string;
    };
  }): Promise<Result<{ refreshToken: string; accessToken: string }, BaseResponse>> {
    // Logger.Info(`Authenticating web client...`);
    const { loginOrEmail, password, connection } = params;
    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [
            {
              login: loginOrEmail
            },
            {
              email: loginOrEmail
            }
          ]
        },
        attributes: ['id', 'passwordHash', 'salt', 'state']
      });
      if (!user) {
        return err({
          success: false,
          message: 'Sorry, there are no user with this email or login!'
        });
      }

      if (user.state === UserState.INITIALIZED) {
        await this.saveLogInAttempt(connection, user, false);
        return err({
          success: false,
          message:
            'Sorry, Your account is not activated, please use activation link we sent You or contact administrator!'
        });
      } else if (user.state === UserState.DISABLED || user.state === UserState.ARCHIVE) {
        await this.saveLogInAttempt(connection, user, false);
        return err({
          success: false,
          message: 'Sorry, Your account have been disabled, please contact administrator!'
        });
      }

      const isMatch = this.crypt.validatePassword(password, user.passwordHash, user.salt);
      if (isMatch) {
        const userSession = await this.saveLogInAttempt(connection, user, true);
        const accessToken = this.jwtHelper.generateToken({
          type: 'access',
          payload: { userId: user.id, sessionId: userSession.id }
        });
        const refreshToken = this.jwtHelper.generateToken({
          type: 'refresh',
          payload: { userId: userSession.UserId, sessionId: userSession.id }
        });

        return ok({ accessToken, refreshToken });
      } else {
        this.saveLogInAttempt(connection, user, false).then(() => {
          return err({
            success: false,
            message:
              'Password that You provided is not correct, please make sure you have the right password or contact administrator!'
          });
        });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async refreshSession(token: string): Promise<Result<{ accessToken: string }, BaseResponse>> {
    if (token) {
      const verifiedResult = await this.jwtHelper.getVerified({ type: 'refresh', token });
      if (verifiedResult.isOk()) {
        const { sessionId, userId } = verifiedResult.value;
        const accessToken = this.jwtHelper.generateToken({ type: 'access', payload: { userId, sessionId } });
        return ok({ accessToken });
      } else {
        return err(verifiedResult.error);
      }
    } else {
      return err({
        success: false,
        message: 'No refresh token!'
      });
    }
  }

  public async forgotPassword(loginOrEmail: string): Promise<Result<BaseResponse, BaseResponse>> {
    // Logger.Info(`Forget password requesting...`);

    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [
            {
              login: loginOrEmail
            },
            {
              email: loginOrEmail
            }
          ]
        }
      });
      if (user) {
        const pa = await user.getPasswordAttributes();
        const token = this.crypt.genTimeLimitedToken(5);

        if (pa) {
          pa.token = token.value;
          pa.tokenExpire = token.expireDate;
          await pa.save();
        } else {
          await user.createPasswordAttributes({
            token: token.value,
            tokenExpire: token.expireDate
          });
        }

        await this.sendMail(MailThemes.PasswordReset, {
          user,
          tokenUrl: `${Config.WEB_URL}/auth/password-reset/${token.value}`
        });

        return ok({
          success: true,
          message: 'A message has been sent to your email address. Follow the instructions to reset your password.'
        });
      } else {
        return err({
          success: false,
          message: 'The following user does not exist! Please, provide correct email or login!'
        });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async resetPassword(params: PasswordReset): Promise<Result<BaseResponse, BaseResponse>> {
    // Logger.Info(`Reseting new password...`);
    try {
      const pa = await PasswordAttribute.findOne({
        where: {
          token: params.token,
          tokenExpire: {
            [Op.gt]: Date.now()
          }
        }
      });
      if (pa) {
        if (params.newPassword === params.verifyPassword) {
          const user = await pa.getUser();
          const passwordData = this.crypt.saltHashPassword(params.newPassword);
          user.passwordHash = passwordData.passwordHash;
          user.salt = passwordData.salt;
          await user.save();

          pa.token = null;
          pa.tokenExpire = null;
          await pa.save();

          await this.sendMail(MailThemes.PasswordResetConfirm, user);
          return ok({
            success: true,
            message: 'You have successfully changed your password.'
          });
        } else {
          return err({ success: false, message: 'Passwords do not match' });
        }
      } else {
        return err({
          success: false,
          message: 'Your password reset token is invalid or has expired!'
        });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  // Private functions
  private saveLogInAttempt(
    connection: { IP: string; UA: string },
    user: UserAttributes,
    isSuccess: boolean
  ): Promise<UserSession> {
    const { IP, UA } = connection;
    return UserSession.create({
      IP,
      UserId: user.id,
      UA,
      isSuccess
    });
  }

  // TODO: check if I can set types dynamically for params
  private sendMail(type: MailThemes, params?: any): Promise<void> {
    switch (type) {
      case MailThemes.Activation:
        return this.mailer.sendActivation(params);
      case MailThemes.ActivationConfirm:
        return this.mailer.sendActivationConfirmation(params);
      case MailThemes.PasswordReset:
        return this.mailer.sendPasswordReset(params);
    }
  }
}
