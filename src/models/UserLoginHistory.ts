import { Sequelize, Model, DataTypes, BelongsToGetAssociationMixin, Association } from 'sequelize';
import { User } from './User';

export class UserLoginHistory extends Model {
  public id!: number;
  public IP!: string;
  public dateLastLoggedIn!: Date;
  public dateUnsuccessfulLogIn!: Date;

  // from assotiations
  public UserId!: number;

  public getUser!: BelongsToGetAssociationMixin<User>;

  public readonly User?: User;

  public static associations: {
    User: Association<UserLoginHistory, User>;
  };
}

export const UserLoginHistoryFactory = (sequelize: Sequelize): void => {
  const userLoginHistory = UserLoginHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      IP: {
        type: new DataTypes.STRING(20)
      },
      dateLastLoggedIn: {
        type: DataTypes.DATE
      },
      dateUnsuccessfulLogIn: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'UserLoginHistory',
      freezeTableName: true,
      timestamps: false,
      sequelize
    }
  );

  return userLoginHistory;
};
