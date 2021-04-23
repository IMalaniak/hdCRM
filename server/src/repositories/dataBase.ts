import { Service } from 'typedi';
import { Op, Sequelize, Transaction } from 'sequelize';

import { Logger } from '../utils/Logger';

import { User, userFactory } from './User';
import { UserSession, userSessionFactory } from './UserSession';
import { PasswordAttribute, passwordAttributeFactory } from './PasswordAttribute';
import { Role, roleFactory } from './Role';
import { Privilege, privilegeFactory } from './Privilege';
import { Asset, assetFactory } from './Asset';
import { Plan, planFactory } from './Plan';
import { Stage, stageFactory } from './Stage';
import { PlanStage, planStageFactory } from './PlanStage';
import { Department, departmentFactory } from './Department';
import { RolePrivilege, rolePrivilegeFactory } from './RolePrivileges';
import { organizationFactory, Organization } from './Organization';
import { taskFactory, Task } from './Task';
import { taskPriorityFactory, TaskPriority } from './TaskPriority';
import { preferenceFactory, Preference } from './Preference';
import { formFactory } from './Form';

@Service()
export class DataBase {
  sequelize!: Sequelize;

  constructor(private readonly logger: Logger) {}

  public init(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.sequelize = new Sequelize(process.env.DATABASE_URL!, {
      operatorsAliases: {
        eq: Op.eq,
        ne: Op.ne,
        is: Op.is,
        not: Op.not,
        or: Op.or,
        gt: Op.gt,
        gte: Op.gte,
        lt: Op.lt,
        lte: Op.lte,
        between: Op.between,
        notBetween: Op.notBetween,
        in: Op.in,
        notIn: Op.notIn,
        like: Op.like,
        notLike: Op.notLike,
        startsWith: Op.startsWith,
        endsWith: Op.endsWith,
        substring: Op.substring,
        iLike: Op.iLike,
        notILike: Op.notILike,
        // eslint-disable-next-line id-blacklist
        any: Op.any
      },
      ...(process.env.NODE_ENV !== 'development' && {
        ssl: true,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<< YOU NEED THIS
          }
        }
      }),
      logging: this.logger.debug.bind(this.logger)
    });
    this.createModels();
  }

  public get connection(): Sequelize {
    return this.sequelize;
  }

  public get transaction(): Promise<Transaction> {
    return this.sequelize.transaction();
  }

  private createModels(): void {
    organizationFactory(this.sequelize);
    assetFactory(this.sequelize);
    departmentFactory(this.sequelize);
    passwordAttributeFactory(this.sequelize);
    planFactory(this.sequelize);
    planStageFactory(this.sequelize);
    privilegeFactory(this.sequelize);
    roleFactory(this.sequelize);
    rolePrivilegeFactory(this.sequelize);
    stageFactory(this.sequelize);
    userFactory(this.sequelize);
    userSessionFactory(this.sequelize);
    taskFactory(this.sequelize);
    taskPriorityFactory(this.sequelize);
    preferenceFactory(this.sequelize);
    formFactory(this.sequelize);

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

    User.belongsTo(Role, { onDelete: 'set null', onUpdate: 'cascade' });
    User.belongsToMany(Plan, {
      as: 'PlansTakesPartIn',
      through: 'UserPlans',
      foreignKey: 'UserId'
    });
    User.hasMany(UserSession);
    User.hasOne(Department, {
      as: 'ManagedDepartment',
      foreignKey: 'managerId'
    });
    User.belongsTo(Department, { constraints: false });
    User.hasOne(PasswordAttribute, {
      as: 'PasswordAttributes',
      foreignKey: 'UserId',
      onDelete: 'cascade'
    });
    User.hasMany(Task, { foreignKey: 'CreatorId' });
    User.hasOne(Preference);
    Preference.belongsTo(User);

    UserSession.belongsTo(User);
    PasswordAttribute.belongsTo(User);
    Role.hasMany(User);
    Plan.belongsTo(User, { as: 'Creator' });
    Plan.belongsToMany(User, {
      as: 'Participants',
      through: 'UserPlans',
      foreignKey: 'PlanId'
    });

    Department.belongsTo(User, { as: 'Manager', foreignKey: 'managerId', onDelete: 'set null', onUpdate: 'cascade' });

    Department.hasMany(User, {
      as: 'Workers',
      foreignKey: 'DepartmentId',
      constraints: false
    });

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

    Task.belongsTo(User, { as: 'Creator' });
    Task.belongsTo(TaskPriority);
    TaskPriority.hasMany(Task);
  }
}
