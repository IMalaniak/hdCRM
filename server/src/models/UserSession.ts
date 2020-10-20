import { Sequelize, Model, DataTypes, BelongsToGetAssociationMixin, Association, Optional } from 'sequelize';

import { User } from './User';

export interface UserSessionAttributes {
  id: string;
  IP: string;
  isSuccess: boolean;
  UA: string;
  UserId: number;
}

export interface UserSessionCreationAttributes extends Optional<UserSessionAttributes, 'id'> {}

export class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes> {
  public id!: number;
  public IP!: string;
  public isSuccess!: boolean;
  public UA!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public UserId!: number;

  public getUser!: BelongsToGetAssociationMixin<User>;

  public readonly User?: User;

  public static associations: {
    User: Association<UserSession, User>;
  };
}

export const UserSessionFactory = (
  sequelize: Sequelize
): Model<UserSessionAttributes, UserSessionCreationAttributes> => {
  return UserSession.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      IP: {
        type: new DataTypes.STRING(20)
      },
      isSuccess: DataTypes.BOOLEAN,
      UA: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'UserSession',
      sequelize
    }
  );
};
