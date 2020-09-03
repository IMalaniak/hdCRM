import {
  User,
  UserSession,
  Role,
  Privilege,
  Preference,
  PasswordAttribute,
  State,
  Asset,
  Department,
  Organization
} from '../models';
import { Logger } from '@overnightjs/logger';
import { IncludeOptions } from 'sequelize/types';
import { CollectionQuery } from 'src/models/apiRequest';
import { Op } from 'sequelize';

export class UserDBController {
  public includes: IncludeOptions[] = [
    {
      model: Role,
      through: {
        attributes: []
      },
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
      model: State
    },
    {
      model: Asset
    },
    {
      model: Asset,
      as: 'avatar'
    },
    {
      model: Department,
      required: false
    },
    {
      model: Organization
    }
  ];

  public getById(userId: number | string): Promise<User> {
    Logger.Info(`Selecting user by id: ${userId}...`);
    return User.findByPk(userId, {
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: this.includes
    });
  }

  public getAll(
    currentUser: User,
    { pageIndex, pageSize, sortIndex, sortDirection }: CollectionQuery
  ): Promise<{ rows: User[]; count: number }> {
    Logger.Info(`Selecting all users...`);
    const limit = parseInt(pageSize);
    const offset = parseInt(pageIndex) * limit;

    return User.findAndCountAll({
      attributes: { exclude: ['passwordHash', 'salt'] },
      where: {
        OrganizationId: currentUser.OrganizationId
      },
      include: this.includes,
      limit,
      offset,
      order: [[sortIndex, sortDirection.toUpperCase()]],
      distinct: true
    });
  }

  public async create(body: Partial<User>): Promise<User> {
    Logger.Info(`Creating new user...`);
    return new Promise((resolve, reject) => {
      User.create(body)
        .then((user) => {
          user
            .reload({
              include: this.includes
            })
            .then((u) => {
              resolve(u);
            })
            .catch((err: any) => {
              reject(err);
            });
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  public updateOne(user: Partial<User>): Promise<[number, User[]]> {
    // TODO: roles etc...
    Logger.Info(`Updating user by id: ${user.id}...`);
    return User.update(
      {
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        defaultLang: user.defaultLang,
        StateId: user.StateId
      },
      {
        where: { id: user.id }
      }
    );
  }

  public updateUserState(user: Partial<User>): Promise<[number, User[]]> {
    Logger.Info(`Updating user state by id: ${user.id}...`);
    return User.update(
      {
        StateId: user.StateId
      },
      {
        where: { id: user.id }
      }
    );
  }

  public deleteOne(id: number | string) {
    Logger.Info(`Deleting user by id: ${id}...`);
    return User.destroy({
      where: { id }
    });
  }

  public getSession(id: number | string) {
    Logger.Info(`Getting user session by id: ${id}...`);
    return UserSession.findByPk(id);
  }

  public getSessionList(user: User) {
    Logger.Info(`Getting session list for user id: ${user.id}...`);
    return user.getUserSessions();
  }

  public removeSession(id: number | string | number[] | string[]) {
    Logger.Info(`Removing user session`);
    return UserSession.destroy({
      where: { id }
    });
  }

  public removeUserSessionsExept(UserId: number, currentSessionId: number) {
    Logger.Info(`Removing user sessions`);
    return UserSession.destroy({
      where: { UserId, [Op.not]: [{ id: currentSessionId }] }
    });
  }

  public editOrg(org: Partial<Organization>) {
    Logger.Info(`Editing userOrg by id: ${org.id}`);
    return Organization.update({ ...org }, { where: { id: org.id } });
  }
}
