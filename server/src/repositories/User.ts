import {
  Sequelize,
  Model,
  DataTypes,
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
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
  Optional
} from 'sequelize';
import * as argon2 from 'argon2';

import { enumToArray } from '../utils/enumToArray';
import { USER_STATE } from '../constants';

import { UserSession } from './UserSession';
import { PasswordAttribute } from './PasswordAttribute';
import { Role } from './Role';
import { Plan } from './Plan';
import { Asset } from './Asset';
import { Department } from './Department';
import { Organization } from './Organization';
import { Task } from './Task';
import { Preference } from './Preference';

export interface UserAttributes {
  id: number;
  email: string;
  name: string;
  surname: string;
  OrganizationId: number;
  password: string;
  fullname?: string;
  phone?: string;
  state?: USER_STATE;
  defaultLang?: string;
  RoleId?: number;
  avatarId?: number;
  DepartmentId?: number;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'fullname' | 'phone' | 'defaultLang' | 'avatarId' | 'DepartmentId'
>;

export class User extends Model<UserAttributes, UserCreationAttributes> {
  public id!: number;
  public email!: string;
  public name!: string;
  public surname!: string;
  public fullname!: string;
  public phone!: string;
  public password!: string;
  public state!: USER_STATE;
  public defaultLang!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public OrganizationId!: number;
  public RoleId!: number;
  public avatarId!: number;
  public DepartmentId!: number;

  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public setOrganization!: BelongsToSetAssociationMixin<Organization, number>;

  public getRole!: BelongsToGetAssociationMixin<Role>;
  public setRole!: BelongsToSetAssociationMixin<Role, number>;

  public addAsset!: BelongsToManyAddAssociationMixin<Asset, number>;
  public addAssets!: BelongsToManyAddAssociationsMixin<Asset, number>;
  public countAssets!: BelongsToManyCountAssociationsMixin;
  public createAsset!: BelongsToManyCreateAssociationMixin<Asset>;
  public getAssets!: BelongsToManyGetAssociationsMixin<Asset>;
  public hasAsset!: BelongsToManyHasAssociationMixin<Asset, number>;
  public hasAssets!: BelongsToManyHasAssociationsMixin<Asset, number>;
  public removeAsset!: BelongsToManyRemoveAssociationMixin<Asset, number>;
  public removeAssets!: BelongsToManyRemoveAssociationsMixin<Asset, number>;
  public setAssets!: BelongsToManySetAssociationsMixin<Asset, number>;

  public createAvatar!: BelongsToCreateAssociationMixin<Asset>;
  public getAvatar!: BelongsToGetAssociationMixin<Asset>;
  public setAvatar!: BelongsToSetAssociationMixin<Asset, number>;

  public countPlansTakesPartIn!: BelongsToManyCountAssociationsMixin;
  public getPlansTakesPartIn!: BelongsToManyGetAssociationsMixin<Plan>;

  public countUserSessions!: HasManyCountAssociationsMixin;
  public createUserSession!: HasManyCreateAssociationMixin<UserSession>;
  public getUserSessions!: HasManyGetAssociationsMixin<UserSession>;
  public hasUserSessionk!: HasManyHasAssociationMixin<UserSession, number>;
  public hasUserSessions!: HasManyHasAssociationsMixin<UserSession, number>;
  public removeUserSession!: HasManyRemoveAssociationMixin<UserSession, number>;
  public removeUserSessions!: HasManyRemoveAssociationsMixin<UserSession, number>;

  public createManagedDepartment!: HasOneCreateAssociationMixin<Department>;
  public getManagedDepartment!: HasOneGetAssociationMixin<Department>;
  public setManagedDepartment!: HasOneSetAssociationMixin<Department, number>;

  public createDepartment!: BelongsToCreateAssociationMixin<Department>;
  public getDepartment!: BelongsToGetAssociationMixin<Department>;
  public setDepartment!: BelongsToSetAssociationMixin<Department, number>;

  public createPasswordAttributes!: HasOneCreateAssociationMixin<PasswordAttribute>;
  public getPasswordAttributes!: HasOneGetAssociationMixin<PasswordAttribute>;
  public setPasswordAttributes!: HasOneSetAssociationMixin<PasswordAttribute, number>;

  public addTask!: HasManyAddAssociationMixin<Task, number>;
  public addTasks!: HasManyAddAssociationsMixin<Task, number>;
  public countTasks!: HasManyCountAssociationsMixin;
  public createTask!: HasManyCreateAssociationMixin<Task>;
  public getTasks!: HasManyGetAssociationsMixin<Task>;
  public hasTask!: HasManyHasAssociationMixin<Task, number>;
  public hasTasks!: HasManyHasAssociationsMixin<Task, number>;
  public removeTask!: HasManyRemoveAssociationMixin<Task, number>;
  public removeTasks!: HasManyRemoveAssociationsMixin<Task, number>;
  public setTasks!: HasManySetAssociationsMixin<Task, number>;

  public createPreference!: HasOneCreateAssociationMixin<Preference>;
  public getPreference!: HasOneGetAssociationMixin<Preference>;
  public setPreference!: HasOneSetAssociationMixin<Preference, number>;

  public readonly Organization?: Organization;
  public readonly Role?: Role;
  public readonly Assets?: Asset[];
  public readonly avatar?: Asset;
  public readonly PlansTakesPartIn?: Plan[];
  public readonly UserSessions?: UserSession[];
  public readonly ManagedDepartment?: Department;
  public readonly Department?: Department;
  public readonly PasswordAttributes?: PasswordAttribute;
  public readonly Tasks?: Task[];
  public readonly Preference?: Preference;

  public static associations: {
    Organization: Association<User, Organization>;
    Role: Association<User, Role>;
    Asset: Association<User, Asset>;
    avatar: Association<User, Asset>;
    PlansTakesPartIn: Association<User, Plan>;
    UserSessions: Association<User, UserSession>;
    ManagedDepartment: Association<User, Department>;
    Department: Association<User, Department>;
    PasswordAttributes: Association<User, PasswordAttribute>;
    Tasks: Association<User, Task>;
    Preference: Association<User, Preference>;
  };
}

export const userFactory = (sequelize: Sequelize): Model => {
  return User.init(
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
      RoleId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Roles',
          key: 'id'
        }
      },
      avatarId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Assets',
          key: 'id'
        }
      },
      DepartmentId: {
        type: DataTypes.INTEGER
      },
      name: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      surname: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      fullname: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.name} ${this.surname}`;
        },
        set(value: string) {
          return ([this.name, this.surname] = [...value.split(' ')] as [string, string]);
        }
      },
      phone: {
        type: DataTypes.STRING,
        unique: {
          msg: 'This phone number is already taken.',
          name: 'Users_phone_key'
        }
      },
      email: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        unique: {
          msg: 'This email is already taken.',
          name: 'Users_email_key'
        },
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING
      },
      defaultLang: {
        type: new DataTypes.CHAR(2)
      },
      state: {
        type: DataTypes.ENUM,
        values: enumToArray(USER_STATE),
        allowNull: false,
        defaultValue: USER_STATE.INITIALIZED
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email']
        }
      ],
      tableName: 'Users',
      hooks: {
        beforeCreate: async (user) => {
          user.password = await argon2.hash(user.password);
        }
      },
      sequelize
    }
  );
};
