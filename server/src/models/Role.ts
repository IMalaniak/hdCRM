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
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Optional
} from 'sequelize';

import { User } from './User';
import { Privilege } from './Privilege';
import { Organization } from './Organization';

export interface RoleAttributes {
  id: string;
  keyString: string;
  OrganizationId: number;
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  public id!: number;
  public keyString!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public OrganizationId!: number;

  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public setOrganization!: BelongsToSetAssociationMixin<Organization, number>;

  public addUser!: HasManyAddAssociationMixin<User, number>;
  public addUsers!: HasManyAddAssociationsMixin<User, number>;
  public countUsers!: HasManyCountAssociationsMixin;
  public createUser!: HasManyCreateAssociationMixin<User>;
  public getUsers!: HasManyGetAssociationsMixin<User>;
  public hasUser!: HasManyHasAssociationMixin<User, number>;
  public hasUsers!: HasManyHasAssociationsMixin<User, number>;
  public removeUser!: HasManyRemoveAssociationMixin<User, number>;
  public removeUsers!: HasManyRemoveAssociationsMixin<User, number>;
  public setUsers!: HasManySetAssociationsMixin<User, number>;

  public addPrivilege!: BelongsToManyAddAssociationMixin<Privilege, number>;
  public addPrivileges!: BelongsToManyAddAssociationsMixin<Privilege, number>;
  public countPrivileges!: BelongsToManyCountAssociationsMixin;
  public createPrivilege!: BelongsToManyCreateAssociationMixin<Privilege>;
  public getPrivileges!: BelongsToManyGetAssociationsMixin<Privilege>;
  public hasPrivilege!: BelongsToManyHasAssociationMixin<Privilege, number>;
  public hasPrivileges!: BelongsToManyHasAssociationsMixin<Privilege, number>;
  public removePrivilege!: BelongsToManyRemoveAssociationMixin<Privilege, number>;
  public removePrivileges!: BelongsToManyRemoveAssociationsMixin<Privilege, number>;
  public setPrivileges!: BelongsToManySetAssociationsMixin<Privilege, number>;

  public readonly Organization?: Organization;
  public readonly Users?: User[];
  public readonly Privileges?: Privilege[];

  public static associations: {
    Organization: Association<Role, Organization>;
    Users: Association<Role, User>;
    Privileges: Association<Role, Privilege>;
  };
}

export const RoleFactory = (sequelize: Sequelize): Model<RoleAttributes, RoleCreationAttributes> => {
  return Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      OrganizationId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      keyString: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      tableName: 'Roles',
      sequelize
    }
  );
};
