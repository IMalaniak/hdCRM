import { Sequelize, Model, DataTypes, BelongsToGetAssociationMixin, Association } from 'sequelize';
import { User } from './User';

export class UserSession extends Model {
  public id!: number;
  public IP!: string;
  public dateLastLoggedIn!: Date;
  public dateUnsuccessfulLogIn!: Date;
  public browser: string;

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

export const UserSessionFactory = (sequelize: Sequelize): void => {
  const userSession = UserSession.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      IP: {
        type: new DataTypes.STRING(20)
      },
      browser: {
        type: DataTypes.STRING
      },
      dateLastLoggedIn: {
        type: DataTypes.DATE
      },
      dateUnsuccessfulLogIn: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'UserSession',
      sequelize
    }
  );

  return userSession;
};
