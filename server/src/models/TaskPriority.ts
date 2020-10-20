import { Sequelize, Model, DataTypes, Association, Optional } from 'sequelize';

import { Task } from './Task';

export interface TaskPriorityAttributes {
  id: string;
  label: string;
  value: number;
}

export interface TaskPriorityCreationAttributes extends Optional<TaskPriorityAttributes, 'id'> {}

export class TaskPriority extends Model<TaskPriorityAttributes, TaskPriorityCreationAttributes> {
  public id!: number;
  public label!: string;
  public value!: number;

  public readonly Tasks?: Task;

  public static associations: {
    Tasks: Association<TaskPriority, Task>;
  };
}

export const TaskPriorityFactory = (
  sequelize: Sequelize
): Model<TaskPriorityAttributes, TaskPriorityCreationAttributes> => {
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
