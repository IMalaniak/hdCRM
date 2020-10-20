import { Sequelize, Model, DataTypes, Optional, Association } from 'sequelize';
import { Plan } from './Plan';
import { Stage } from './Stage';

export interface PlanStageAttributes {
  id: string;
  order: number;
  completed: boolean;
  description?: string;
  PlanId: number;
  StageId: number;
}

export interface PlanStageCreationAttributes extends Optional<PlanStageAttributes, 'id' | 'description'> {}

export class PlanStage extends Model<PlanStageAttributes, PlanStageCreationAttributes> {
  public id!: number;
  public order!: number;
  public completed!: boolean;
  public description!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from associations
  public PlanId!: number;
  public StageId!: number;

  public readonly Stage?: Stage;

  public static associations: {
    Plan: Association<PlanStage, Plan>;
    Stage: Association<PlanStage, Stage>;
  };
}

export const PlanStageFactory = (sequelize: Sequelize): Model<PlanStageAttributes, PlanStageCreationAttributes> => {
  return PlanStage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      PlanId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Plan',
          key: 'id'
        }
      },
      StageId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Stages',
          key: 'id'
        }
      },
      description: {
        type: DataTypes.TEXT
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      tableName: 'PlanStages',
      sequelize
    }
  );
};
