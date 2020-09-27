import { Sequelize, Model, DataTypes } from 'sequelize';

export class PlanStage extends Model {
  public id!: number;
  public keyString!: string;
  public order!: number;
  public description!: string;
  public completed!: boolean;

  // from associations
  public PlanId!: number;
  public StageId!: number;
}

export const PlanStageFactory = (sequelize: Sequelize): Model => {
  return PlanStage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
