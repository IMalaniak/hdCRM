import { Service } from 'typedi';
import { Result, ok, err } from 'neverthrow';
import { IncludeOptions, Op } from 'sequelize';

import {
  BaseResponse,
  CollectionApiResponse,
  Role,
  User,
  Asset,
  ItemApiResponse,
  PageQueryWithOrganization,
  RoleCreationAttributes,
  RoleAttributes,
  Privilege
} from '../models';
import { CONSTANTS } from '../constants';

@Service()
export class RoleService {
  private includes: IncludeOptions[] = [
    {
      model: Privilege as any,
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
          model: Asset as any,
          as: 'avatar',
          required: false
        }
      ],
      required: false
    }
  ];

  public async getDashboardData(OrganizationId: number): Promise<Result<CollectionApiResponse<Role>, BaseResponse>> {
    // Logger.Info(`Geting roles dashboard data...`);
    try {
      const data = await Role.findAndCountAll({
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
      // Logger.Err(error);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getDataById(id: string): Promise<Result<ItemApiResponse<Role>, BaseResponse>> {
    // Logger.Info(`Selecting role by id: ${id}...`);
    try {
      const role = await this.findByPk(id);
      if (role) {
        return ok({ success: true, data: role });
      } else {
        return ok({ success: false, message: 'No role with such id', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async getPage(
    pageQuery: PageQueryWithOrganization
  ): Promise<Result<CollectionApiResponse<Role>, BaseResponse>> {
    // Logger.Info(`Getting roles by page query...`);
    try {
      const { limit, offset, sortDirection, sortIndex, OrganizationId } = pageQuery;

      const data = await Role.findAndCountAll({
        where: {
          OrganizationId
        },
        include: [...this.includes],
        limit,
        offset,
        order: [[sortIndex, sortDirection]],
        distinct: true
      });

      if (data.count) {
        const pages = Math.ceil(data.count / limit);
        const ids: number[] = data.rows.map((user) => user.id);
        return ok({ success: true, ids, data: data.rows, resultsNum: data.count, pages });
      } else {
        return ok({ success: false, message: 'No roles by this query', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async create(role: RoleCreationAttributes): Promise<Result<ItemApiResponse<Role>, BaseResponse>> {
    // Logger.Info(`Creating new role...`);

    try {
      const createdRole = await Role.create({
        keyString: role.keyString,
        OrganizationId: role.OrganizationId
      });

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

        await createdRole.setPrivileges(privileges);
      }

      if (role.Users) {
        const users = await User.findAll({
          where: {
            [Op.or]: role.Users as { id: number }[]
          }
        });

        await createdRole.setUsers(users);
      }

      const data = await this.findByPk(createdRole.id);

      if (data) {
        return ok({ success: true, message: 'Role created successfully!', data });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async updateOne(role: RoleAttributes): Promise<Result<ItemApiResponse<Role>, BaseResponse>> {
    // Logger.Info(`Updating role by id: ${role.id}...`);
    try {
      await Role.update(
        {
          keyString: role.keyString
        },
        {
          where: { id: role.id }
        }
      );

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

        await (await Role.findByPk(role.id, { attributes: ['id'] })).setPrivileges(privileges);
      }

      if (role.Users) {
        const users = await User.findAll({
          where: {
            [Op.or]: role.Users as { id: number }[]
          }
        });

        await (await Role.findByPk(role.id, { attributes: ['id'] })).setUsers(users);
      }

      const data = await this.findByPk(role.id);

      if (data) {
        return ok({ success: true, message: 'Role updated successfully!', data });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  public async delete(id: string | number | string[] | number[]): Promise<Result<BaseResponse, BaseResponse>> {
    // Logger.Info(`Deleting role(s) by id: ${id}...`);
    try {
      const deleted = await Role.destroy({
        where: { id }
      });

      if (deleted > 0) {
        return ok({ success: true, message: `Deleted ${deleted} role` });
      } else {
        return ok({ success: false, message: 'No roles by this query', data: null });
      }
    } catch (error) {
      // Logger.Err(err);
      return err({ success: false, message: CONSTANTS.TEXTS_API_GENERIC_ERROR });
    }
  }

  // Private functions
  private findByPk(id: number | string): Promise<Role> {
    return Role.findByPk(id, {
      include: [...this.includes]
    });
  }
}
