import {
  Sequelize,
  Model,
  DataTypes,
  Association,
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
import { Department } from './Department';
import { Plan } from './Plan';
import { Role } from './Role';

export interface OrganizationAttributes {
  id: number;
  type: string;
  title?: string;
  token?: string;
  country?: string;
  city?: string;
  address?: string;
  postcode?: string;
  phone?: number;
  email?: string;
  website?: string;
  employees?: string;
}

export type OrganizationCreationAttributes = Optional<
  OrganizationAttributes,
  'id' | 'title' | 'token' | 'country' | 'city' | 'address' | 'postcode' | 'phone' | 'email' | 'website' | 'employees'
>;

export class Organization extends Model<OrganizationAttributes, OrganizationCreationAttributes> {
  public id!: number;
  public type!: string;
  public title?: string;
  public token?: string;
  public country?: string;
  public city?: string;
  public address?: string;
  public postcode?: string;
  public phone?: number;
  public email?: string;
  public website?: string;
  public employees?: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Departments?: Department[];
  public readonly Plans?: Plan[];
  public readonly Roles?: Role[];
  public readonly Users?: User[];

  public addDepartment!: HasManyAddAssociationMixin<Department, number>;
  public addDepartments!: HasManyAddAssociationsMixin<Department, number>;
  public countDepartments!: HasManyCountAssociationsMixin;
  public createDepartment!: HasManyCreateAssociationMixin<Department>;
  public getDepartments!: HasManyGetAssociationsMixin<Department>;
  public hasDepartment!: HasManyHasAssociationMixin<Department, number>;
  public hasDepartments!: HasManyHasAssociationsMixin<Department, number>;
  public removeDepartment!: HasManyRemoveAssociationMixin<Department, number>;
  public removeDepartments!: HasManyRemoveAssociationsMixin<Department, number>;
  public setDepartments!: HasManySetAssociationsMixin<Department, number>;

  public addPlan!: HasManyAddAssociationMixin<Plan, number>;
  public addPlans!: HasManyAddAssociationsMixin<Plan, number>;
  public countPlans!: HasManyCountAssociationsMixin;
  public createPlan!: HasManyCreateAssociationMixin<Plan>;
  public getPlans!: HasManyGetAssociationsMixin<Plan>;
  public hasPlan!: HasManyHasAssociationMixin<Plan, number>;
  public hasPlans!: HasManyHasAssociationsMixin<Plan, number>;
  public removePlan!: HasManyRemoveAssociationMixin<Plan, number>;
  public removePlans!: HasManyRemoveAssociationsMixin<Plan, number>;
  public setPlans!: HasManySetAssociationsMixin<Plan, number>;

  public addRole!: HasManyAddAssociationMixin<Role, number>;
  public addRoles!: HasManyAddAssociationsMixin<Role, number>;
  public countRoles!: HasManyCountAssociationsMixin;
  public createRole!: HasManyCreateAssociationMixin<Role>;
  public getRoles!: HasManyGetAssociationsMixin<Role>;
  public hasRole!: HasManyHasAssociationMixin<Role, number>;
  public hasRoles!: HasManyHasAssociationsMixin<Role, number>;
  public removeRole!: HasManyRemoveAssociationMixin<Role, number>;
  public removeRoles!: HasManyRemoveAssociationsMixin<Role, number>;
  public setRoles!: HasManySetAssociationsMixin<Role, number>;

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

  public static associations: {
    Departments: Association<Organization, Department>;
    Plans: Association<Organization, Plan>;
    Roles: Association<Organization, Role>;
    Users: Association<Organization, User>;
  };
}

export const organizationFactory = (sequelize: Sequelize): Model => {
  return Organization.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: new DataTypes.STRING(50),
        unique: {
          msg: 'Organization with this title already exists.',
          name: 'Organizations_title_key'
        },
        allowNull: true
      },
      token: {
        type: DataTypes.STRING,
        unique: true
      },
      type: {
        type: new DataTypes.STRING(15),
        allowNull: false
      },
      country: DataTypes.STRING(50),
      city: DataTypes.STRING(50),
      address: DataTypes.STRING,
      postcode: DataTypes.STRING(10),
      phone: {
        type: DataTypes.STRING,
        unique: {
          msg: 'Organization with this phone already exists.',
          name: 'Organizations_phone_key'
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: 'Organization with this email already exists.',
          name: 'Organizations_email_key'
        },
        validate: {
          isEmail: true
        }
      },
      website: {
        type: DataTypes.STRING(100),
        unique: {
          msg: 'Organization with this website already exists.',
          name: 'Organizations_website_key'
        },
        validate: {
          isUrl: true
        }
      }
    },
    {
      tableName: 'Organizations',
      sequelize
    }
  );
};
