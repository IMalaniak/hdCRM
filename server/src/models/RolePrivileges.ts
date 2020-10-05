import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import { Role } from './Role';
import { Privilege } from './Privilege';

export class RolePrivilege extends Model {
  public PrivilegeId!: number;
  public RoleId!: number;
  public view!: boolean;
  public edit!: boolean;
  public add!: boolean;
  public delete!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Roles?: Role[];
  public readonly Privileges?: Privilege[];

  public static associations: {
    Roles: Association<RolePrivilege, Role>;
    Privileges: Association<RolePrivilege, Privilege>;
  };
}

export const RolePrivilegeFactory = (sequelize: Sequelize): Model => {
  return RolePrivilege.init(
    {
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
