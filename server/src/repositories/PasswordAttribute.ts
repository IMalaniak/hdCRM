import { Sequelize, Model, DataTypes, BelongsToGetAssociationMixin, Association, Optional } from 'sequelize';

import { User } from './User';

export interface PasswordAttributeAttributes {
  id: number;
  token: string | null;
  tokenExpire: Date | null;
  passwordExpire: Date;
  UserId: number;
}

export type PasswordAttributeCreationAttributes = Optional<PasswordAttributeAttributes, 'id'>;

export class PasswordAttribute extends Model<PasswordAttributeAttributes, PasswordAttributeCreationAttributes> {
  public id!: number;
  public token!: string | null;
  public tokenExpire!: Date | null;
  public passwordExpire!: Date;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // from assotiations
  public UserId!: number;

  public getUser!: BelongsToGetAssociationMixin<User>;

  public readonly User?: User;

  public static associations: {
    User: Association<PasswordAttribute, User>;
  };
}

export const passwordAttributeFactory = (sequelize: Sequelize): Model => {
  return PasswordAttribute.init(
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
      token: {
        type: DataTypes.STRING,
        unique: true
      },
      tokenExpire: DataTypes.DATE,
      passwordExpire: DataTypes.DATE
    },
    {
      tableName: 'PasswordAttributes',
      sequelize
    }
  );
};
