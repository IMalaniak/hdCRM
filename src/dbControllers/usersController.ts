import * as db from '../models';
import { Logger } from '@overnightjs/logger';
import { IncludeOptions } from 'sequelize/types';
import { Op } from 'sequelize';

export class UserDBController {
  public includes: IncludeOptions[] = [
    {
      model: db.Role,
      through: {
        attributes: []
      },
      required: false,
      include: [
        {
          model: db.Privilege,
          through: {
            attributes: ['view', 'edit', 'add', 'delete']
          },
          required: false
        }
      ]
    },
    {
      model: db.UserSession
    },
    {
      model: db.Preference,
      required: false
    },
    {
      model: db.PasswordAttribute,
      as: 'PasswordAttributes',
      attributes: ['updatedAt', 'passwordExpire'],
      required: false
    },
    {
      model: db.State
    },
    {
      model: db.Asset
    },
    {
      model: db.Asset,
      as: 'avatar'
    },
    {
      model: db.Department,
      required: false
    },
    {
      model: db.Organization
    }
  ];

  public getById(userId: number | string): Promise<db.User> {
    Logger.Info(`Selecting user by id: ${userId}...`);
    return db.User.findByPk(userId, {
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: this.includes
    });
  }

  public getAll(currentUser: db.User, queryParams: any): Promise<{ rows: db.User[]; count: number }> {
    Logger.Info(`Selecting all users...`);
    const limit = parseInt(queryParams.pageSize);
    const offset = parseInt(queryParams.pageIndex) * limit;

    return db.User.findAndCountAll({
      attributes: { exclude: ['passwordHash', 'salt'] },
      where: {
        OrganizationId: currentUser.OrganizationId
      },
      include: this.includes,
      limit,
      offset,
      order: [[queryParams.sortIndex, queryParams.sortDirection.toUpperCase()]],
      distinct: true
    });
  }

  public async create(body: db.User): Promise<db.User> {
    Logger.Info(`Creating new user...`);
    return new Promise((resolve, reject) => {
      db.User.create(body)
        .then(user => {
          user
            .reload({
              include: this.includes
            })
            .then(u => {
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

  public updateOne(user: db.User): Promise<[number, db.User[]]> {
    // TODO: roles etc...
    Logger.Info(`Updating user by id: ${user.id}...`);
    return db.User.update(
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

  public updateUserState(user: db.User): Promise<[number, db.User[]]> {
    Logger.Info(`Updating user state by id: ${user.id}...`);
    return db.User.update(
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
    return db.User.destroy({
      where: { id }
    });
  }

  public getSession(id: number | string) {
    Logger.Info(`Getting user session by id: ${id}...`);
    return db.UserSession.findByPk(id);
  }

  public getSessionList(user: db.User) {
    Logger.Info(`Getting session list for user id: ${user.id}...`);
    return user.getUserSessions();
  }

  public removeSession(id: number | string | number[] | string[]) {
    Logger.Info(`Removing user session`);
    return db.UserSession.destroy({
      where: { id }
    });
  }

  public removeUserSessionsExept(UserId: number, id: number) {
    Logger.Info(`Removing user sessions`);
    return db.UserSession.destroy({
      where: { UserId, [Op.not]: [{ id }] }
    });
  }

  public editOrg(org: db.Organization) {
    Logger.Info(`Editing userOrg by id: ${org.id}`);
    return db.Organization.update({ ...org }, { where: { id: org.id } });
  }
}
