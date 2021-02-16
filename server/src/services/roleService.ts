import Container, { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, Op } from 'sequelize';

import {
  BaseResponse,
  CollectionApiResponse,
  Role,
  User,
  RoleCreationAttributes,
  RoleAttributes,
  Privilege
} from '../models';
import { CONSTANTS } from '../constants';
import { BaseService } from './base/BaseService';

Container.set(CONSTANTS.MODEL, Role);
Container.set(CONSTANTS.MODELS_NAME, CONSTANTS.MODELS_NAME_ROLE);

@Service()
export class RoleService extends BaseService<RoleCreationAttributes, RoleAttributes, Role> {
  public readonly enableSideEffects = true;
  public readonly includes: IncludeOptions[] = [
    {
      association: Role.associations.Privileges,
      through: {
        attributes: ['view', 'edit', 'add', 'delete']
      },
      required: false
    },
    {
      association: Role.associations.Users,
      attributes: { exclude: ['passwordHash', 'salt'] },
      include: [
        {
          association: User.associations.avatar,
          required: false
        }
      ],
      required: false
    }
  ];

  public async getDashboardData(OrganizationId: number): Promise<Result<CollectionApiResponse<Role>, BaseResponse>> {
    try {
      const data = await this.MODEL.findAndCountAll({
        attributes: ['keyString', 'id'],
        where: {
          OrganizationId
        },
        include: [
          {
            association: Role.associations.Users,
            attributes: ['id'],
            required: true
          }
        ],
        order: [['id', 'ASC']]
      });
      return ok({ success: true, data: data.rows, resultsNum: data.count });
    } catch (error) {
      this.logger.error(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async sideEffect(role: Role, id: number): Promise<Role> {
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
        privilege.RolePrivilege = role.Privileges.find((reqPriv) => reqPriv.id === privilege.id).RolePrivilege;
        return privilege;
      });

      await (await Role.findByPk(id, { attributes: ['id'] })).setPrivileges(privileges);
    }

    if (role.Users) {
      const users = await User.findAll({
        where: {
          [Op.or]: role.Users as { id: number }[]
        }
      });

      await (await Role.findByPk(id, { attributes: ['id'] })).setUsers(users);
    }

    return this.findByPk(id);
  }
}
