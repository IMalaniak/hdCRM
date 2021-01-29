import {
  Sequelize,
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  Association,
  Optional
} from 'sequelize';

import { IListView, ITimeFormat, IDateFormat, IItemsPerPage } from '../constants';
import { enumToArray } from '../utils/EnumToArray';
import { User } from './User';

export interface PreferenceAttributes {
  id: number;
  listView: IListView;
  timeFormat: ITimeFormat;
  dateFormat: IDateFormat;
  itemsPerPage: IItemsPerPage;
  listOutlineBorders: boolean;
  UserId: number;
}

export interface PreferenceCreationAttributes extends Optional<PreferenceAttributes, 'id'> {}

export class Preference extends Model<PreferenceAttributes, PreferenceCreationAttributes> {
  public id!: number;
  public listView!: IListView;
  public timeFormat!: ITimeFormat;
  public dateFormat!: IDateFormat;
  public itemsPerPage!: IItemsPerPage;
  public listOutlineBorders: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // form associations
  public UserId!: number;
  public readonly User!: User;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;

  public static associations: {
    User: Association<Preference, User>;
  };
}

export const PreferenceFactory = (sequelize: Sequelize): Model<PreferenceAttributes, PreferenceCreationAttributes> => {
  return Preference.init(
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
      listView: {
        type: DataTypes.ENUM,
        values: enumToArray(IListView),
        allowNull: false,
        defaultValue: IListView.LIST
      },
      timeFormat: {
        type: DataTypes.ENUM,
        values: enumToArray(ITimeFormat),
        allowNull: false,
        defaultValue: ITimeFormat.LONG_TIME
      },
      dateFormat: {
        type: DataTypes.ENUM,
        values: enumToArray(IDateFormat),
        allowNull: false,
        defaultValue: IDateFormat.FULL_DATE
      },
      itemsPerPage: {
        type: DataTypes.ENUM,
        values: enumToArray(IItemsPerPage),
        allowNull: false,
        defaultValue: IItemsPerPage.FIVE
      },
      listOutlineBorders: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'Preferences',
      sequelize
    }
  );
};
