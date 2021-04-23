import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { Op, Transaction, UniqueConstraintError } from 'sequelize';
import * as argon2 from 'argon2';

import { BaseResponse, PasswordReset } from '../models';
import { MAIL_THEME, USER_STATE } from '../constants';
import { Config } from '../config';
import {
  BadRequestError,
  CustomError,
  ForbiddenError,
  InternalServerError,
  NotAuthorizedError,
  NotFoundError
} from '../errors';
import {
  OrganizationCreationAttributes,
  UserCreationAttributes,
  Organization,
  Privilege,
  PasswordAttribute,
  User,
  UserAttributes,
  UserSession,
  DataBase,
  Role
} from '../repositories';
import { Logger } from '../utils/Logger';
import { CryptoUtils } from '../utils/crypto.utils';
import { EmailUtils } from '../utils/email.utils';
import { JwtUtils } from '../utils/jwt.utils';
import { AuthResponse } from '../models/authResponse';
import { DatabaseUniqueFieldError } from '../errors/database-unique-field-error';

@Service()
export class AuthService {
  constructor(
    private readonly crypt: CryptoUtils,
    private readonly mailer: EmailUtils,
    private readonly jwtHelper: JwtUtils,
    private readonly logger: Logger,
    private readonly db: DataBase
  ) {}

  public async register(params: {
    organization: OrganizationCreationAttributes;
    user: Partial<UserCreationAttributes>;
  }): Promise<Result<BaseResponse, CustomError>> {
    const { organization, user } = params;

    const transaction: Transaction = await this.db.transaction;

    try {
      const createdOrg = await Organization.create(organization, {
        include: Role,
        transaction
      });
      const createdUser = await createdOrg.createUser(
        {
          ...user
        },
        { transaction }
      );

      const privileges = await Privilege.findAll();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const adminRole = createdOrg.Roles![0]!;
      await adminRole.setPrivileges(privileges, { transaction });
      const rPrivileges = await adminRole.getPrivileges();
      for (const privilege of rPrivileges) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const rPriv = privilege.RolePrivilege!;
        rPriv.add = true;
        rPriv.delete = true;
        rPriv.edit = true;
        rPriv.view = true;
        await rPriv.save({ transaction });
      }
      await adminRole.addUser(createdUser, { transaction });

      const token = this.crypt.genTimeLimitedToken(24 * 60);
      await createdUser.createPasswordAttributes(
        {
          token: token.value,
          tokenExpire: token.expireDate,
          passwordExpire: token.expireDate
        },
        { transaction }
      );

      await transaction.commit();

      await this.sendMail(MAIL_THEME.ACTIVATIONN, {
        user: createdUser,
        tmpPassword: user.password,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        url: `${Config.WEB_URL!}/auth/activate-account/${token.value}`
      });

      return ok({
        message: 'Activation link has been sent'
      });
    } catch (error) {
      await transaction.rollback();
      if (error instanceof UniqueConstraintError) {
        return err(new DatabaseUniqueFieldError(error));
      }
      this.logger.error(error);
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

        await this.sendMail(MAIL_THEME.ACTIVATION_CONFIRM, user);
        return ok({
          message: 'You account has been activated successfully!'
        });
      } else {
        return err(new BadRequestError('Your activation token is invalid or has expired!'));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async authenticate(params: {
    email: string;
    password: string;
    connection: {
      IP: string;
      UA: string | undefined;
    };
  }): Promise<Result<AuthResponse, CustomError>> {
    const { email, password, connection } = params;
    try {
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'password', 'state']
      });
      if (!user) {
        return err(new BadRequestError('Email/Login or password you provided is incorrect!'));
      }

      if (user.state === USER_STATE.INITIALIZED) {
        await this.saveLogInAttempt(connection, user, false);
        return err(
          new ForbiddenError(
            'Sorry, Your account is not activated, please use activation link we sent You or contact administrator!'
          )
        );
      } else if (user.state === USER_STATE.DISABLED || user.state === USER_STATE.ARCHIVE) {
        await this.saveLogInAttempt(connection, user, false);
        return err(new ForbiddenError('Sorry, Your account have been disabled, please contact administrator!'));
      }

      const isMatch = await argon2.verify(user.password, password);
      if (isMatch) {
        if (this.isPasswordExpired(await user.getPasswordAttributes())) {
          return err(
            new ForbiddenError(
              'Your password has expired, please click on "forgot password" button to reset your password!'
            )
          );
        } else {
          const userSession = await this.saveLogInAttempt(connection, user, true);
          const {
            token: accessToken,
            decoded: { exp }
          } = this.jwtHelper.sign({
            type: 'access',
            payload: { sub: user.id }
          });
          const {
            token: refreshToken,
            decoded: { sub }
          } = this.jwtHelper.sign({
            type: 'refresh',
            payload: { sub: userSession.id }
          });

          return ok({ accessToken, refreshToken, tokenType: 'bearer', expiresIn: exp, sessionId: sub });
        }
      } else {
        await this.saveLogInAttempt(connection, user, false);
        return err(
          new NotAuthorizedError(
            'Password that You provided is not correct, please make sure you have the right password or contact administrator!'
          )
        );
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async oauth(params: {
    user: User;
    connection: {
      IP: string;
      UA: string | undefined;
    };
  }): Promise<Result<AuthResponse, CustomError>> {
    const { user, connection } = params;
    try {
      const userSession = await this.saveLogInAttempt(connection, user, true);
      const {
        token: accessToken,
        decoded: { exp }
      } = this.jwtHelper.sign({
        type: 'access',
        payload: { sub: user.id }
      });
      const {
        token: refreshToken,
        decoded: { sub }
      } = this.jwtHelper.sign({
        type: 'refresh',
        payload: { sub: userSession.id }
      });

      return ok({ accessToken, refreshToken, tokenType: 'bearer', expiresIn: exp, sessionId: sub });
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async refreshSession(token: string | undefined): Promise<Result<AuthResponse, CustomError>> {
    if (token) {
      const userSession = await this.jwtHelper.verifyAndGetSubject({ type: 'refresh', token });
      if (userSession.isOk()) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { UserId, id } = userSession.value as UserSession;
        const userPA = await PasswordAttribute.findOne({ where: { UserId } });
        if (userPA && this.isPasswordExpired(userPA)) {
          return err(
            new NotAuthorizedError(
              'Your password has expired, please click on "forgot password" button to reset your password!'
            )
          );
        } else {
          const {
            token: accessToken,
            decoded: { exp }
          } = this.jwtHelper.sign({ type: 'access', payload: { sub: UserId } });
          return ok({ accessToken, tokenType: 'bearer', expiresIn: exp, sessionId: id });
        }
      } else {
        return err(userSession.error);
      }
    } else {
      return err(new BadRequestError('No refresh token!'));
    }
  }

  public async forgotPassword(email: string): Promise<Result<BaseResponse, CustomError>> {
    try {
      const user = await User.findOne({
        where: { email }
      });
      if (user) {
        const pa = await user.getPasswordAttributes();
        const token = this.crypt.genTimeLimitedToken(5);

        if (pa.id) {
          pa.token = token.value;
          pa.tokenExpire = token.expireDate;
          await pa.save();
        } else {
          await user.createPasswordAttributes({
            token: token.value,
            tokenExpire: token.expireDate
          });
        }

        await this.sendMail(MAIL_THEME.PASSWORD_RESET, {
          user,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          tokenUrl: `${Config.WEB_URL!}/auth/password-reset/${token.value}`
        });

        return ok({
          message: 'A message has been sent to your email address. Follow the instructions to reset your password.'
        });
      } else {
        return err(new NotFoundError('The following user does not exist! Please, provide correct email or login!'));
      }
    } catch (error) {
      this.logger.error(error);
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
          user.password = await argon2.hash(params.newPassword);
          await user.save();

          pa.token = null;
          pa.tokenExpire = null;
          pa.passwordExpire = new Date();
          pa.passwordExpire.setDate(pa.passwordExpire.getDate() + 30);
          await pa.save();

          await this.sendMail(MAIL_THEME.PASSWORD_RESET_CONFIRM, user);
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
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  // Private functions
  private saveLogInAttempt(
    connection: { IP: string; UA: string | undefined },
    user: UserAttributes,
    isSuccess: boolean
  ): Promise<UserSession> {
    const { IP, UA } = connection;
    return UserSession.create({
      IP,
      UserId: user.id,
      isSuccess,
      UA
    });
  }

  // TODO: check if I can set types dynamically for params
  private sendMail(type: MAIL_THEME, params?: any): Promise<any> {
    switch (type) {
      case MAIL_THEME.ACTIVATIONN:
        return this.mailer.sendActivation(params);
      case MAIL_THEME.ACTIVATION_CONFIRM:
        return this.mailer.sendActivationConfirmation(params);
      case MAIL_THEME.PASSWORD_RESET:
        return this.mailer.sendPasswordReset(params);
      case MAIL_THEME.PASSWORD_RESET_CONFIRM:
        return this.mailer.sendPasswordResetConfirmation(params);
      default:
        return Promise.reject();
    }
  }

  private isPasswordExpired(pa: PasswordAttribute): boolean {
    return pa.passwordExpire <= new Date();
  }
}
