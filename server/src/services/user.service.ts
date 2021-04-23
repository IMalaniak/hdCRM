/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import * as argon2 from 'argon2';
import Container, { Service } from 'typedi';
import { Op, IncludeOptions, Transaction } from 'sequelize';
import { err, ok, Result } from 'neverthrow';

import { ItemApiResponse, BaseResponse, CollectionApiResponse, PasswordReset, GoogleTokenPayload } from '../models';
import { CONSTANTS, MAIL_THEME, USER_STATE } from '../constants';
import { Config } from '../config';
import { BadRequestError, CustomError, InternalServerError, NotAuthorizedError, NotFoundError } from '../errors';
import {
  UserCreationAttributes,
  UserAttributes,
  User,
  Role,
  UserSession,
  OrganizationAttributes,
  Organization,
  Privilege,
  Preference,
  PasswordAttribute,
  Department,
  DataBase
} from '../repositories';
import { CryptoUtils } from '../utils/crypto.utils';
import { EmailUtils } from '../utils/email.utils';

import { reduceResults } from './utils';
import { BaseService } from './base/base.service';

@Service()
export class UserService extends BaseService<UserCreationAttributes, UserAttributes, User> {
  protected excludes: string[] = ['password'];
  protected readonly includes: IncludeOptions[] = [
    {
      model: Role,
      required: false,
      include: [
        {
          model: Privilege,
          through: {
            attributes: ['view', 'edit', 'add', 'delete']
          },
          required: false
        }
      ]
    },
    {
      model: UserSession
    },
    {
      model: Preference,
      required: false
    },
    {
      model: PasswordAttribute,
      as: 'PasswordAttributes',
      attributes: ['updatedAt', 'passwordExpire'],
      required: false
    },
    {
      model: Department,
      required: false
    },
    {
      model: Organization
    }
  ];

  constructor(private readonly mailer: EmailUtils, private readonly crypt: CryptoUtils, private readonly db: DataBase) {
    super();
    Container.set(CONSTANTS.MODEL, User);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_USER);
  }

  public async updatePassword(
    passData: PasswordReset & { userId: number; sessionId?: number }
  ): Promise<Result<BaseResponse, CustomError>> {
    try {
      if (passData.newPassword === passData.verifyPassword) {
        const user = await User.findByPk(passData.userId);

        if (!user) {
          return err(new NotFoundError('User not found!'));
        }

        const validatePassword = await argon2.verify(user.password, passData.oldPassword);
        if (validatePassword) {
          user.password = await argon2.hash(passData.newPassword);

          await user.save();
          await this.sendMail(MAIL_THEME.PASSWORD_RESET_CONFIRM, user);

          if (passData.deleteSessions) {
            const sessionRemoved = await this.removeUserSessionsExept(passData.userId, passData.sessionId);
            if (sessionRemoved.isErr()) {
              return ok({
                message:
                  'You have changed your password, but there was a problem trying to delete your other active sessions, please do it manually in the "Sessions tab".'
              });
            }
          }
          return ok({
            message: 'You have successfully changed your password.'
          });
        } else {
          return err(new NotAuthorizedError('Current password you provided is not correct!'));
        }
      } else {
        return err(new BadRequestError('New passwords do not match!'));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async getSession(id: number | string): Promise<Result<ItemApiResponse<UserSession>, CustomError>> {
    try {
      const data = await UserSession.findByPk(id);
      if (data) {
        return ok({ data });
      } else {
        return err(new NotFoundError('No session with such id'));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async getSessionList(
    user: User
  ): Promise<Result<CollectionApiResponse<UserSession> | BaseResponse, CustomError>> {
    try {
      const data = await user.getUserSessions();

      if (data.length) {
        return ok({ data });
      } else {
        return ok({});
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async removeSession(id: number | string | number[] | string[]): Promise<Result<BaseResponse, CustomError>> {
    try {
      const deleted = await UserSession.destroy({
        where: { id }
      });

      if (deleted > 0) {
        return ok({ message: `Deleted ${deleted} session(s)` });
      } else {
        return err(new NotFoundError('No sessions by this query'));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async removeUserSessionsExept(
    userId: number,
    currentSessionId: number | undefined
  ): Promise<Result<BaseResponse, CustomError>> {
    try {
      const deleted = await UserSession.destroy({
        where: { UserId: userId, [Op.and]: [{ [Op.not]: [{ id: currentSessionId }] }] }
      });

      if (deleted > 0) {
        return ok({ message: `Deleted ${deleted} session(s)` });
      } else {
        return err(new NotFoundError('No sessions by this query'));
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async updateOrg(org: OrganizationAttributes): Promise<Result<ItemApiResponse<Organization>, CustomError>> {
    try {
      await Organization.update(
        {
          ...org
        },
        {
          where: { id: org.id }
        }
      );

      const data = (await Organization.findByPk(org.id)) as Organization;

      return ok({ message: 'Organization is updated successfully!', data });
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async invite(user: UserAttributes, orgId: number): Promise<Result<ItemApiResponse<User>, CustomError>> {
    try {
      const password = this.crypt.genRandomString(12);
      user.password = password;
      user.OrganizationId = orgId;
      if (!user.fullname) {
        return err(new BadRequestError('Full name is not provided'));
      }
      const result = await this.create(user);

      if (result.isOk()) {
        const { data } = result.value;
        const token = this.crypt.genTimeLimitedToken(24 * 60);
        await data.createPasswordAttributes({
          token: token.value,
          tokenExpire: token.expireDate,
          passwordExpire: token.expireDate
        });

        const newUser = await this.findByPk(data.id);

        await this.sendMail(MAIL_THEME.INVITATION, {
          user: newUser,
          password,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          url: `${Config.WEB_URL!}/auth/activate-account/${token.value}`
        });

        return ok({ message: 'Invitation have been sent successfully!', data });
      } else {
        return err(result.error);
      }
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  public async inviteMultiple(
    users: UserAttributes[],
    orgId: number
  ): Promise<Result<CollectionApiResponse<User>, CustomError>> {
    const results = await Promise.all(users.map((user: UserAttributes) => this.invite(user, orgId)));
    const { values, errors } = reduceResults(results);
    const invitedUsers: User[] = values.map((value) => value.data);

    if (errors.length && errors[0] && !invitedUsers.length) {
      return err(errors[0]);
    } else if (errors.length && invitedUsers.length) {
      return ok({
        message: 'Success, but not all users were invited due to some problems...',
        data: invitedUsers
      });
    } else {
      return ok({ message: 'Invitations have been sent successfully!', data: invitedUsers });
    }
  }

  public async prepareOauthUser(payload: GoogleTokenPayload): Promise<Result<User, CustomError>> {
    const transaction: Transaction = await this.db.transaction;
    try {
      // find out if there is already associated account
      const userExist = await this.findOneWhere({ googleId: payload.sub }, transaction);
      if (userExist) {
        await transaction.commit();
        return ok(userExist);
      } else {
        // if no associated account - check if there is already an account with such email and then asscociate this account
        const userResult = await this.findOneWhere({ email: payload.email }, transaction);
        if (userResult) {
          if (userResult.state !== USER_STATE.ACTIVE) {
            userResult.state = USER_STATE.ACTIVE;
          }
          userResult.googleId = payload.sub;
          if (!userResult.picture) {
            userResult.picture = payload.picture;
          }
          if (!userResult.locale) {
            userResult.locale = payload.locale;
          }
          await userResult.save({ transaction });
          await userResult.reload({ transaction });
          await transaction.commit();
          return ok(userResult);
        } else {
          // if no associated account - create a new one
          const orgDefaults = {
            Roles: [
              {
                keyString: 'admin'
              }
            ]
          } as Organization;
          const newOrg = await Organization.create(
            {
              ...orgDefaults,
              type: 'private'
            },
            {
              include: Role,
              transaction
            }
          );
          const newUser = await newOrg.createUser(
            {
              email: payload.email,
              fullname: payload.name,
              picture: payload.picture,
              googleId: payload.sub,
              locale: payload.locale
            },
            { transaction }
          );
          // no need to verify email because it is verified by oauth
          newUser.state = USER_STATE.ACTIVE;
          await newUser.save({ transaction });

          const privileges = await Privilege.findAll({ transaction });
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const adminRole = newOrg.Roles![0]!;
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
          await adminRole.addUser(newUser, { transaction });
          await transaction.commit();

          await this.sendMail(MAIL_THEME.OAUTH_WELCOME, {
            user: newUser
          });

          const user = (await this.findByPk(newUser.id)) as User;
          return ok(user);
        }
      }
    } catch (error) {
      await transaction.rollback();
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  // TODO: check if I can set types dynamically for params
  private sendMail(type: MAIL_THEME, params?: any): Promise<any> {
    switch (type) {
      case MAIL_THEME.PASSWORD_RESET_CONFIRM:
        return this.mailer.sendPasswordResetConfirmation(params);
      case MAIL_THEME.INVITATION:
        return this.mailer.sendInvitation(params);
      case MAIL_THEME.OAUTH_WELCOME:
        return this.mailer.oauthWelcome(params);
      default:
        return Promise.reject();
    }
  }
}
