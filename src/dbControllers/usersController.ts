import * as db from '../models';
import { Logger } from '@overnightjs/logger';
import { IncludeOptions } from 'sequelize/types';

export class UserDBController {
  private includes: IncludeOptions[] = [
    {
      model: db.Role,
      through: {
        attributes: []
      }
    },
    {
      model: db.UserLoginHistory
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
    }
  ];

  public getById(userId: number | string): Promise<db.User> {
    Logger.Info(`Selecting user by id: ${userId}...`);
    return db.User.findByPk(userId, {
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: this.includes
    });
  }

  public getAll(currentUser: any, queryParams: any): Promise<{ rows: db.User[]; count: number }> {
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

  public create(body: db.User): Promise<db.User> {
    Logger.Info(`Creating new user...`);
    return db.User.create(body);
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
}
