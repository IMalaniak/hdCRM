import { Sequelize, Model, DataTypes, Association } from 'sequelize';

import { Role } from './Role';
import { Privilege } from './Privilege';

export interface RolePrivilegeAttributes {
  RoleId: number;
  PrivilegeId: number;
  view: boolean;
  edit: boolean;
  add: boolean;
  delete: boolean;
}

export class RolePrivilege extends Model<RolePrivilegeAttributes> {
  public view!: boolean;
  public edit!: boolean;
  public add!: boolean;
  public delete!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public RoleId!: number;
  public PrivilegeId!: number;
  public readonly Role?: Role;
  public readonly Privilege?: Privilege;

  public static associations: {
    Roles: Association<RolePrivilege, Role>;
    Privileges: Association<RolePrivilege, Privilege>;
  };
}

export const rolePrivilegeFactory = (sequelize: Sequelize): Model => {
  return RolePrivilege.init(
    {
      RoleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Roles',
          key: 'id'
        }
      },
      PrivilegeId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Privileges',
          key: 'id'
        }
      },
      view: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      add: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      edit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'RolePrivileges',
      sequelize
    }
  );
};
