import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import { Task } from './Task';

export class TaskPriority extends Model {
  public id!: number;
  public label!: string;
  public value!: number;

  public readonly Tasks?: Task;

  public static associations: {
    Tasks: Association<TaskPriority, Task>;
  };
}

export const TaskPriorityFactory = (sequelize: Sequelize): Model => {
  return TaskPriority.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      label: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      value: {
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'TaskPriorities',
      timestamps: false,
      sequelize
    }
  );
};
