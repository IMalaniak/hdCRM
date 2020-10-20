import { Sequelize, Model, DataTypes, Association, BelongsToGetAssociationMixin, Optional } from 'sequelize';

import { TaskPriority } from './TaskPriority';
import { User } from './User';

export interface TaskAttributes {
  id: string;
  title: string;
  isCompleted?: boolean;
  description?: string;
  CreatorId: number;
  TaskPriorityId: number;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description' | 'isCompleted'> {}

export class Task extends Model<TaskAttributes, TaskCreationAttributes> {
  public id!: number;
  public title!: string;
  public description!: string;
  public isCompleted!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public CreatorId!: number;
  public TaskPriorityId!: number;

  public getCreator!: BelongsToGetAssociationMixin<User>;
  // TODO @IMalaniak add methods for priority

  public readonly Creator?: User;
  public readonly Priority?: TaskPriority;

  public static associations: {
    Creator: Association<Task, User>;
    Priority: Association<Task, TaskPriority>;
  };
}

export const TaskFactory = (sequelize: Sequelize): Model<TaskAttributes, TaskCreationAttributes> => {
  return Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CreatorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      TaskPriorityId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'TaskPriorities',
          key: 'id'
        }
      },
      title: {
        type: new DataTypes.STRING(75),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: DataTypes.TEXT,
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'Tasks',
      sequelize
    }
  );
};
