import {
  Sequelize,
  Model,
  DataTypes,
  Association,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  Optional
} from 'sequelize';

import { Role } from './Role';
import { RolePrivilege } from './RolePrivileges';

export interface PrivilegeAttributes {
  id: number;
  keyString: string;
  title?: string;
}

export type PrivilegeCreationAttributes = Optional<PrivilegeAttributes, 'id' | 'title'>;

export class Privilege extends Model<PrivilegeAttributes, PrivilegeCreationAttributes> {
  public id!: number;
  public keyString!: string;
  public title!: string;

  public addRole!: BelongsToManyAddAssociationMixin<Role, number>;
  public addRoles!: BelongsToManyAddAssociationsMixin<Role, number>;
  public countRoles!: BelongsToManyCountAssociationsMixin;
  public createRole!: BelongsToManyCreateAssociationMixin<Role>;
  public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
  public hasRole!: BelongsToManyHasAssociationMixin<Role, number>;
  public hasRoles!: BelongsToManyHasAssociationsMixin<Role, number>;
  public removeRole!: BelongsToManyRemoveAssociationMixin<Role, number>;
  public removeRoles!: BelongsToManyRemoveAssociationsMixin<Role, number>;
  public setRoles!: BelongsToManySetAssociationsMixin<Role, number>;

  public readonly Roles?: Role[];
  public RolePrivilege?: RolePrivilege;

  public static associations: {
    Roles: Association<Privilege, Role>;
  };
}

export const privilegeFactory = (sequelize: Sequelize): Model => {
  return Privilege.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      keyString: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      title: {
        type: new DataTypes.STRING(50)
      }
    },
    {
      tableName: 'Privileges',
      timestamps: false,
      sequelize
    }
  );
};
