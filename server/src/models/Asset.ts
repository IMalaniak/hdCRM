import {
  Sequelize,
  Model,
  DataTypes,
  Association,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  Optional
} from 'sequelize';

import { User } from './User';
import { Plan } from './Plan';

export interface AssetAttributes {
  id: string;
  title: string;
  location: string;
  type: string;
}

export interface AssetCreationAttributes extends Optional<AssetAttributes, 'id'> {}
export class Asset extends Model<AssetAttributes, AssetCreationAttributes> {
  public id!: number;
  public title!: string;
  public location!: string;
  public type!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addUser!: BelongsToManyAddAssociationMixin<User, number>;
  public addUsers!: BelongsToManyAddAssociationsMixin<User, number>;
  public countUsers!: BelongsToManyCountAssociationsMixin;
  public createUser!: BelongsToManyCreateAssociationMixin<User>;
  public getUsers!: BelongsToManyGetAssociationsMixin<User>;
  public hasUser!: BelongsToManyHasAssociationMixin<User, number>;
  public hasUsers!: BelongsToManyHasAssociationsMixin<User, number>;
  public removeUser!: BelongsToManyRemoveAssociationMixin<User, number>;
  public removeUsers!: BelongsToManyRemoveAssociationsMixin<User, number>;
  public setUsers!: BelongsToManySetAssociationsMixin<User, number>;

  public addPlan!: BelongsToManyAddAssociationMixin<Plan, number>;
  public addPlans!: BelongsToManyAddAssociationsMixin<Plan, number>;
  public countPlans!: BelongsToManyCountAssociationsMixin;
  public createPlan!: BelongsToManyCreateAssociationMixin<Plan>;
  public getPlans!: BelongsToManyGetAssociationsMixin<Plan>;
  public hasPlan!: BelongsToManyHasAssociationMixin<Plan, number>;
  public hasPlans!: BelongsToManyHasAssociationsMixin<Plan, number>;
  public removePlan!: BelongsToManyRemoveAssociationMixin<Plan, number>;
  public removePlans!: BelongsToManyRemoveAssociationsMixin<Plan, number>;
  public setPlans!: BelongsToManySetAssociationsMixin<Plan, number>;

  public readonly Users?: User[];
  public readonly Plans?: Plan[];

  public static associations: {
    Users: Association<Asset, User>;
    Plans: Association<Asset, Plan>;
  };
}

export const AssetFactory = (sequelize: Sequelize): Model<AssetAttributes, AssetCreationAttributes> => {
  return Asset.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: new DataTypes.STRING(250),
        allowNull: false
      },
      location: {
        type: new DataTypes.STRING(250),
        allowNull: false
      },
      type: {
        type: new DataTypes.STRING(250),
        allowNull: false
      }
    },
    {
      tableName: 'Assets',
      sequelize
    }
  );
};
