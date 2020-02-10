import { Sequelize } from 'sequelize';
import { User, UserFactory } from './User';
import { Logger } from '@overnightjs/logger';
import { UserLoginHistory, UserLoginHistoryFactory } from './UserLoginHistory';
import { PasswordAttribute, PasswordAttributeFactory } from './PasswordAttribute';
import { State, StateFactory } from './State';
import { Role, RoleFactory } from './Role';
import { Privilege, PrivilegeFactory } from './Privilege';
import { Asset, AssetFactory } from './Asset';
import { Plan, PlanFactory } from './Plan';
import { Stage, StageFactory } from './Stage';
import { PlanStage, PlanStageFactory } from './PlanStage';
import { Department, DepartmentFactory } from './Department';
import { RolePrivilege, RolePrivilegeFactory } from './RolePrivileges';
import { OrganizationFactory, Organization } from './Organization';

class DataBase {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(process.env.DATABASE_URL);
    this.createModels();
  }

  private createModels(): void {
    OrganizationFactory(this.sequelize);
    AssetFactory(this.sequelize);
    DepartmentFactory(this.sequelize);
    PasswordAttributeFactory(this.sequelize);
    PlanFactory(this.sequelize);
    PlanStageFactory(this.sequelize);
    PrivilegeFactory(this.sequelize);
    RoleFactory(this.sequelize);
    RolePrivilegeFactory(this.sequelize);
    StageFactory(this.sequelize);
    StateFactory(this.sequelize);
    UserFactory(this.sequelize);
    UserLoginHistoryFactory(this.sequelize);

    // associations
    Organization.hasMany(Department, {
      onDelete: 'cascade'
    });
    Organization.hasMany(Plan);
    Organization.hasMany(Role);
    Organization.hasMany(User);

    Department.belongsTo(Organization);
    Plan.belongsTo(Organization);
    Role.belongsTo(Organization);
    User.belongsTo(Organization);

    User.belongsToMany(Role, { through: 'UserRoles', foreignKey: 'UserId' });
    User.belongsToMany(Asset, { through: 'UserAssets', foreignKey: 'UserId' });
    User.belongsTo(Asset, { as: 'avatar' });
    User.belongsToMany(Plan, {
      as: 'PlansTakesPartIn',
      through: 'UserPlans',
      foreignKey: 'UserId'
    });
    User.belongsTo(State);
    User.hasOne(UserLoginHistory);
    User.hasOne(Department, {
      as: 'ManagedDepartment',
      foreignKey: 'managerId',
      onDelete: 'set null'
    });
    User.belongsTo(Department, { constraints: false });
    User.hasOne(PasswordAttribute, {
      as: 'PasswordAttributes',
      foreignKey: 'UserId',
      onDelete: 'cascade'
    });
    UserLoginHistory.belongsTo(User);
    PasswordAttribute.belongsTo(User);
    State.hasMany(User);
    Asset.belongsToMany(User, { through: 'UserAssets', foreignKey: 'AssetId' });
    Role.belongsToMany(User, { through: 'UserRoles', foreignKey: 'RoleId' });
    Plan.belongsTo(User, { as: 'Creator' });
    Plan.belongsToMany(User, {
      as: 'Participants',
      through: 'UserPlans',
      foreignKey: 'PlanId'
    });
    Department.hasMany(User, { as: 'Workers', constraints: false });
    Department.belongsTo(User, { as: 'Manager', foreignKey: 'managerId' });

    Role.belongsToMany(Privilege, {
      through: RolePrivilege,
      foreignKey: 'RoleId'
    });
    Privilege.belongsToMany(Role, {
      through: RolePrivilege,
      foreignKey: 'PrivilegeId'
    });

    Plan.belongsToMany(Asset, {
      as: 'Documents',
      through: 'PlanAssets',
      foreignKey: 'PlanId'
    });
    Plan.belongsTo(Stage, { as: 'activeStage' });
    Plan.belongsToMany(Stage, {
      as: 'Stages',
      through: PlanStage,
      foreignKey: 'PlanId'
    });
    Stage.hasMany(Plan, { foreignKey: 'activeStageId' });
    Stage.belongsToMany(Plan, {
      as: 'StagePlans',
      through: PlanStage,
      foreignKey: 'StageId'
    });
    Asset.belongsToMany(Plan, { through: 'PlanAssets', foreignKey: 'AssetId' });

    Department.belongsTo(Department, {
      as: 'ParentDepartment',
      foreignKey: 'parentDepId'
    });
    Department.hasMany(Department, {
      as: 'SubDepartments',
      foreignKey: 'parentDepId'
    });

    Logger.Info(`DataBase inited`);
  }

  public get sequel(): Sequelize {
    return this.sequelize;
  }
}

export default DataBase;

export {
  Asset,
  Department,
  PasswordAttribute,
  Plan,
  PlanStage,
  Privilege,
  Role,
  RolePrivilege,
  Stage,
  State,
  User,
  UserLoginHistory,
  Organization,
  Sequelize
};
