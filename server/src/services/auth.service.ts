import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { Op } from 'sequelize';

import { BaseResponse, PasswordReset } from '../models';
import { MAIL_THEME, USER_STATE } from '../constants';
import { Config } from '../config';
import { BadRequestError, CustomError, InternalServerError, NotAuthorizedError, NotFoundError } from '../errors';
import {
  OrganizationCreationAttributes,
  UserCreationAttributes,
  Organization,
  Privilege,
  PasswordAttribute,
  User,
  UserAttributes,
  UserSession
} from '../repositories';
import { Logger } from '../utils/Logger';
import { CryptoUtils } from '../utils/crypto.utils';
import { EmailUtils } from '../utils/email.utils';
import { JwtUtils } from '../utils/jwt.utils';

@Service()
export class AuthService {
  constructor(
    private readonly crypt: CryptoUtils,
    private readonly mailer: EmailUtils,
    private readonly jwtHelper: JwtUtils,
    private readonly logger: Logger
  ) {}

  public async register(params: {
    organization: OrganizationCreationAttributes;
    user: Partial<UserCreationAttributes>;
    password: string;
  }): Promise<Result<BaseResponse, CustomError>> {
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

      await this.sendMail(MAIL_THEME.Activation, {
        user: createdUser,
        tmpPassword: password,
        url: `${Config.WEB_URL}/auth/activate-account/${token.value}`
      });

      return ok({
        message: 'Activation link has been sent'
      });
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async activateAccount(token: string): Promise<Result<BaseResponse, CustomError>> {
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
        user.state = USER_STATE.ACTIVE;
        await user.save();
        pa.token = null;
        pa.tokenExpire = null;
        await pa.save();

        await this.sendMail(MAIL_THEME.ActivationConfirm, user);
        return ok({
          message: 'You account has been activated successfully!'
        });
      } else {
        return err(new BadRequestError('Your activation token is invalid or has expired!'));
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async authenticate(params: {
    loginOrEmail: string;
    password: string;
    connection: {
      IP: string;
      UA: string;
    };
  }): Promise<Result<{ refreshToken: string; accessToken: string }, CustomError>> {
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
        return err(new NotFoundError('Sorry, there are no user with this email or login!'));
      }

      if (user.state === USER_STATE.INITIALIZED) {
        await this.saveLogInAttempt(connection, user, false);
        return err(
          new NotAuthorizedError(
            'Sorry, Your account is not activated, please use activation link we sent You or contact administrator!'
          )
        );
      } else if (user.state === USER_STATE.DISABLED || user.state === USER_STATE.ARCHIVE) {
        await this.saveLogInAttempt(connection, user, false);
        return err(new NotAuthorizedError('Sorry, Your account have been disabled, please contact administrator!'));
      }

      const isMatch = this.crypt.validatePassword(password, user.passwordHash, user.salt);
      if (isMatch) {
        if (this.isPasswordExpired(await user.getPasswordAttributes())) {
          return err(
            new NotAuthorizedError(
              'Your password has expired, please click on "forgot password" button to reset your password!'
            )
          );
        } else {
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
        }
      } else {
        this.saveLogInAttempt(connection, user, false).then(() => {
          return err(
            new NotAuthorizedError(
              'Password that You provided is not correct, please make sure you have the right password or contact administrator!'
            )
          );
        });
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async refreshSession(token: string): Promise<Result<{ accessToken: string }, CustomError>> {
    if (token) {
      const verifiedResult = await this.jwtHelper.getVerified({ type: 'refresh', token });
      if (verifiedResult.isOk()) {
        const { sessionId, userId } = verifiedResult.value;
        const userPA = await PasswordAttribute.findOne({ where: { UserId: userId } });
        if (this.isPasswordExpired(userPA)) {
          return err(
            new NotAuthorizedError(
              'Your password has expired, please click on "forgot password" button to reset your password!'
            )
          );
        } else {
          const accessToken = this.jwtHelper.generateToken({ type: 'access', payload: { userId, sessionId } });
          return ok({ accessToken });
        }
      } else {
        return err(verifiedResult.error);
      }
    } else {
      return err(new BadRequestError('No refresh token!'));
    }
  }

  public async forgotPassword(loginOrEmail: string): Promise<Result<BaseResponse, CustomError>> {
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

        await this.sendMail(MAIL_THEME.PasswordReset, {
          user,
          tokenUrl: `${Config.WEB_URL}/auth/password-reset/${token.value}`
        });

        return ok({
          message: 'A message has been sent to your email address. Follow the instructions to reset your password.'
        });
      } else {
        return err(new NotFoundError('The following user does not exist! Please, provide correct email or login!'));
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async resetPassword(params: PasswordReset): Promise<Result<BaseResponse, CustomError>> {
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
          pa.passwordExpire = new Date();
          pa.passwordExpire.setDate(pa.passwordExpire.getDate() + 30);
          await pa.save();

          await this.sendMail(MAIL_THEME.PasswordResetConfirm, user);
          return ok({
            message: 'You have successfully changed your password.'
          });
        } else {
          return err(new BadRequestError('Passwords do not match'));
        }
      } else {
        return err(new NotAuthorizedError('Your password reset token is invalid or has expired!'));
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
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
  private sendMail(type: MAIL_THEME, params?: any): Promise<void> {
    switch (type) {
      case MAIL_THEME.Activation:
        return this.mailer.sendActivation(params);
      case MAIL_THEME.ActivationConfirm:
        return this.mailer.sendActivationConfirmation(params);
      case MAIL_THEME.PasswordReset:
        return this.mailer.sendPasswordReset(params);
    }
  }

  private isPasswordExpired(pa: PasswordAttribute): boolean {
    return pa.passwordExpire <= new Date();
  }
}
