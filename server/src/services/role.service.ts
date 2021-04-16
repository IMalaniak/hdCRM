/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, Op } from 'sequelize';

import { CollectionApiResponse } from '../models';
import { CONSTANTS } from '../constants';
import { CustomError, InternalServerError } from '../errors';
import { RoleCreationAttributes, RoleAttributes, Role, User, Privilege } from '../repositories';

import { BaseService } from './base/base.service';

@Service()
export class RoleService extends BaseService<RoleCreationAttributes, RoleAttributes, Role> {
  protected readonly includes: IncludeOptions[] = [
    {
      association: Role.associations?.Privileges,
      through: {
        attributes: ['view', 'edit', 'add', 'delete']
      },
      required: false
    },
    {
      association: Role.associations?.Users,
      attributes: { exclude: ['password'] },
      include: [
        {
          association: User.associations?.avatar,
          required: false
        }
      ],
      required: false
    }
  ];

  constructor() {
    super();
    Container.set(CONSTANTS.MODEL, Role);
    Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_ROLE);
  }

  public async getDashboardData(organizationId: number): Promise<Result<CollectionApiResponse<Role>, CustomError>> {
    try {
      const data = await this.MODEL.findAndCountAll({
        attributes: ['keyString', 'id'],
        where: {
          OrganizationId: organizationId
        },
        include: [
          {
            association: Role.associations?.Users,
            attributes: ['id'],
            required: true
          }
        ],
        order: [['id', 'ASC']]
      });
      return ok({ data: data.rows, resultsNum: data.count });
    } catch (error) {
      this.logger.error(error);
      return err(new InternalServerError());
    }
  }

  protected async postAction(role: Role, id: number): Promise<Role> {
    if (role.Privileges) {
      const privIds = role.Privileges.map((priv) => {
        return {
          id: priv.id
        };
      });

      let privileges = await Privilege.findAll({
        where: {
          [Op.or]: privIds
        }
      });

      privileges = privileges.map((privilege) => {
        privilege.RolePrivilege = role.Privileges?.find((reqPriv) => reqPriv.id === privilege.id)?.RolePrivilege;
        return privilege;
      });

      await ((await Role.findByPk(id, { attributes: ['id'] })) as Role).setPrivileges(privileges);
    }

    if (role.Users) {
      const users = await User.findAll({
        where: {
          [Op.or]: role.Users as { id: number }[]
        }
      });

      await ((await Role.findByPk(id, { attributes: ['id'] })) as Role).setUsers(users);
    }

    return this.findByPk(id) as Promise<Role>;
  }
}
