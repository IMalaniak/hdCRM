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
  HasManySetAssociationsMixin
} from 'sequelize';
import { UserSession } from './UserSession';
import { PasswordAttribute } from './PasswordAttribute';
import { State } from './State';
import { Role } from './Role';
import { Plan } from './Plan';
import { Asset } from './Asset';
import { Department } from './Department';
import { Organization } from './Organization';
import { Task } from './Task';

export class User extends Model {
  public id!: number;
  public email!: string;
  public login!: string;
  public name!: string;
  public surname!: string;
  public readonly fullname!: string;
  public phone!: string;
  public passwordHash!: string;
  public salt!: string;
  public defaultLang!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public OrganizationId!: number;
  public StateId!: number;
  public avatarId!: number;
  public DepartmentId!: number;

  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public setOrganization!: BelongsToSetAssociationMixin<Organization, number>;

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

  public createState!: BelongsToCreateAssociationMixin<State>;
  public getState!: BelongsToGetAssociationMixin<State>;
  public setState!: BelongsToSetAssociationMixin<State, number>;

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

  public readonly Organization?: Organization;
  public readonly Roles?: Role[];
  public readonly Assets?: Asset[];
  public readonly avatar?: Asset;
  public readonly PlansTakesPartIn?: Plan[];
  public readonly State?: State;
  public readonly UserSession?: UserSession;
  public readonly ManagedDepartment?: Department;
  public readonly Department?: Department;
  public readonly PasswordAttributes?: PasswordAttribute;
  public readonly Tasks?: Task[];

  public static associations: {
    Organization: Association<User, Organization>;
    Roles: Association<User, Role>;
    Asset: Association<User, Asset>;
    avatar: Association<User, Asset>;
    PlansTakesPartIn: Association<User, Plan>;
    State: Association<User, State>;
    UserSession: Association<User, UserSession>;
    ManagedDepartment: Association<User, Department>;
    Department: Association<User, Department>;
    PasswordAttributes: Association<User, PasswordAttribute>;
    Tasks: Association<User, Task>;
  };
}

export const UserFactory = (sequelize: Sequelize): void => {
  const user = User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: new DataTypes.STRING(50),
        allowNull: false
      },
      surname: {
        type: new DataTypes.STRING(50),
        allowNull: false
      },
      fullname: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.name} ${this.surname}`;
        },
        set(value: string) {
          return ([this.name, this.surname] = [...value.split(' ')]);
        }
      },
      phone: {
        type: new DataTypes.CHAR(15)
      },
      email: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      login: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      defaultLang: {
        type: new DataTypes.CHAR(2)
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email']
        },
        {
          unique: true,
          fields: ['login']
        }
      ],
      tableName: 'Users',
      sequelize
    }
  );

  return user;
};
