import { Sequelize, Model, DataTypes, Association, BelongsToGetAssociationMixin } from 'sequelize';
import { TaskPriority } from '.';
import { User } from './User';

export class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public isCompleted!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public CreatorId!: number;
  public PriorityId!: number;

  public getCreator!: BelongsToGetAssociationMixin<User>;
  // TODO @IMalaniak add methods for priority

  public readonly Creator?: User;

  public static associations: {
    Creator: Association<Task, User>;
    Priority: Association<Task, TaskPriority>;
  };
}

export const TaskFactory = (sequelize: Sequelize): Model => {
  return Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
