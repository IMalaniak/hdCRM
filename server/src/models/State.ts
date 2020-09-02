import {
  Sequelize,
  Model,
  DataTypes,
  Association,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin
} from 'sequelize';
import { User } from './User';

export class State extends Model {
  public id!: number;
  public keyString!: string;

  public addUser!: HasManyAddAssociationMixin<User, number>;
  public addUsers!: HasManyAddAssociationsMixin<User, number>;
  public countUsers!: HasManyCountAssociationsMixin;
  public createUser!: HasManyCreateAssociationMixin<User>;
  public getUsers!: HasManyGetAssociationsMixin<User>;
  public hasUser!: HasManyHasAssociationMixin<User, number>;
  public hasUsers!: HasManyHasAssociationsMixin<User, number>;
  public removeUser!: HasManyRemoveAssociationMixin<User, number>;
  public removeUsers!: HasManyRemoveAssociationsMixin<User, number>;
  public setUsers!: HasManySetAssociationsMixin<User, number>;

  public readonly Users?: User[];

  public static associations: {
    Users: Association<State, User>;
  };
}

export const StateFactory = (sequelize: Sequelize): void => {
  const state = State.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      keyString: {
        type: new DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      tableName: 'States',
      timestamps: false,
      sequelize
    }
  );

  return state;
};
