import Container, { Service } from 'typedi';
import { Op, IncludeOptions } from 'sequelize';
import { err, ok, Result } from 'neverthrow';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { ItemApiResponse, BaseResponse, CollectionApiResponse, PasswordReset } from '../models';
import { CONSTANTS, MAIL_THEME } from '../constants';
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
  AssetCreationAttributes,
  Asset
} from '../repositories';
import { EmailUtils, CryptoUtils } from '../utils';
import { reduceResults } from './utils';
import { BaseService } from './base/base.service';

@Service()
export class UserService extends BaseService<UserCreationAttributes, UserAttributes, User> {
  private unlinkAsync = promisify(fs.unlink);
  protected excludes: string[] = ['passwordHash', 'salt'];
  protected readonly includes: IncludeOptions[] = [
    {
      association: User.associations?.Role,
      required: false,
      include: [
        {
          association: Role.associations?.Privileges,
          through: {
            attributes: ['view', 'edit', 'add', 'delete']
          },
          required: false
        }
      ]
    },
    {
      association: User.associations?.UserSessions
    },
    {
      association: User.associations?.Preference,
      required: false
    },
    {
      association: User.associations?.PasswordAttributes,
      attributes: ['updatedAt', 'passwordExpire'],
      required: false
    },
    {
      association: User.associations?.avatar
    },
    {
      association: User.associations?.Department,
      required: false
    },
    {
      association: User.associations?.Organization
    }
  ];

  constructor(private readonly mailer: EmailUtils, private readonly crypt: CryptoUtils) {
    super();
    Container.set(CONSTANTS.MODEL, User);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_USER);
  }

  public async updatePassword(
    passData: Partial<PasswordReset> & { userId: number; sessionId?: number }
  ): Promise<Result<BaseResponse, CustomError>> {
    try {
      if (passData.newPassword === passData.verifyPassword) {
        const user = await User.findByPk(passData.userId);

        const validatePassword = this.crypt.validatePassword(passData.oldPassword, user.passwordHash, user.salt);
        if (validatePassword) {
          const newPasswordData = this.crypt.saltHashPassword(passData.newPassword);
          user.passwordHash = newPasswordData.passwordHash;
          user.salt = newPasswordData.salt;

          await user.save();
          await this.sendMail(MAIL_THEME.PasswordResetConfirm, user);

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
      this.logger.error(error.message);
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
      this.logger.error(error.message);
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
      this.logger.error(error.message);
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
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async removeUserSessionsExept(
    UserId: number,
    currentSessionId: number
  ): Promise<Result<BaseResponse, CustomError>> {
    try {
      const deleted = await UserSession.destroy({
        where: { UserId, [Op.and]: [{ [Op.not]: [{ id: currentSessionId }] }] }
      });

      if (deleted > 0) {
        return ok({ message: `Deleted ${deleted} session(s)` });
      } else {
        return err(new NotFoundError('No sessions by this query'));
      }
    } catch (error) {
      this.logger.error(error.message);
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

      const data = await Organization.findByPk(org.id);

      if (data) {
        return ok({ message: 'Organization is updated successfully!', data });
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async invite(user: UserAttributes, orgId: number): Promise<Result<ItemApiResponse<User>, CustomError>> {
    try {
      const password = this.crypt.genRandomString(12);
      const passwordData = this.crypt.saltHashPassword(password);
      user.passwordHash = passwordData.passwordHash;
      user.salt = passwordData.salt;
      user.OrganizationId = orgId;
      user.login = user.fullname.replace(' ', '_');
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

        await this.sendMail(MAIL_THEME.Invitation, {
          user: newUser,
          password,
          url: `${Config.WEB_URL}/auth/activate-account/${token.value}`
        });

        return ok({ message: 'Invitation have been sent successfully!', data });
      } else {
        return err(result.error);
      }
    } catch (error) {
      this.logger.error(error.message);
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

    if (errors.length && !invitedUsers.length) {
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

  public async updateAvatar(params: {
    avatar: AssetCreationAttributes;
    userId: string;
  }): Promise<Result<ItemApiResponse<Asset>, CustomError>> {
    let message: string;

    try {
      const { avatar, userId } = params;

      const user = await User.findByPk(userId);
      const userAvatar = await user.getAvatar();

      if (userAvatar) {
        await Asset.destroy({
          where: { id: avatar.id }
        });

        const uploadsPath = path.join(__dirname, '../../uploads');
        const destination = uploadsPath + avatar.location + '/' + avatar.title;
        const thumbDestination = uploadsPath + avatar.location + '/thumbnails/' + avatar.title;
        await this.unlinkAsync(destination);
        await this.unlinkAsync(thumbDestination);

        message = 'User profile picture is updated successfully!';
      } else {
        message = 'User profile picture is added successfully!';
      }
      const newAvatar = await user.createAvatar(avatar as any);

      return ok({
        message,
        data: newAvatar
      });
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  public async deleteAvatar(userId: string): Promise<Result<BaseResponse, CustomError>> {
    try {
      const user = await User.findByPk(userId);
      const userAvatar = await user.getAvatar();
      if (userAvatar) {
        await Asset.destroy({
          where: { id: userAvatar.id }
        });

        const uploadsPath = path.join(__dirname, '../../uploads');
        const destination = uploadsPath + userAvatar.location + '/' + userAvatar.title;
        const thumbDestination = uploadsPath + userAvatar.location + '/thumbnails/' + userAvatar.title;
        await this.unlinkAsync(destination);
        await this.unlinkAsync(thumbDestination);

        return ok({ message: 'Profile picture is deleted' });
      }
    } catch (error) {
      this.logger.error(error.message);
      return err(new InternalServerError());
    }
  }

  // TODO: check if I can set types dynamically for params
  private sendMail(type: MAIL_THEME, params?: any): Promise<void> {
    switch (type) {
      case MAIL_THEME.PasswordResetConfirm:
        return this.mailer.sendPasswordResetConfirmation(params);
      case MAIL_THEME.Invitation:
        return this.mailer.sendInvitation(params);
    }
  }
}
