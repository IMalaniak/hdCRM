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
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin
} from 'sequelize';
import { Plan } from './Plan';
import { PlanStage } from '.';

export class Stage extends Model {
  public id!: number;
  public keyString!: string;

  public addStagePlan!: BelongsToManyAddAssociationMixin<Plan, number>;
  public addStagePlans!: BelongsToManyAddAssociationsMixin<Plan, number>;
  public countStagePlans!: BelongsToManyCountAssociationsMixin;
  public createStagePlan!: BelongsToManyCreateAssociationMixin<Plan>;
  public getStagePlans!: BelongsToManyGetAssociationsMixin<Plan>;
  public hasStagePlan!: BelongsToManyHasAssociationMixin<Plan, number>;
  public hasStagePlans!: BelongsToManyHasAssociationsMixin<Plan, number>;
  public removeStagePlan!: BelongsToManyRemoveAssociationMixin<Plan, number>;
  public removeStagePlans!: BelongsToManyRemoveAssociationsMixin<Plan, number>;
  public setStagePlans!: BelongsToManySetAssociationsMixin<Plan, number>;

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

  public readonly Plans?: Plan[];
  public readonly StagePlans?: Plan[];
  public Details?: PlanStage;

  public static associations: {
    Plans: Association<Stage, Plan>;
    StagePlans: Association<Stage, Plan>;
  };
}

export const StageFactory = (sequelize: Sequelize): Model => {
  return Stage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      keyString: {
        type: new DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      tableName: 'Stages',
      timestamps: false,
      sequelize
    }
  );
};
