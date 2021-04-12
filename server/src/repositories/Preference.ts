import {
  Sequelize,
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  Association,
  Optional
} from 'sequelize';

import { LIST_VIEW, TIME_FORMAT, DATE_FORMAT, ITEMS_PER_PAGE } from '../constants';
import { enumToArray } from '../utils/enumToArray';
import { User } from './User';

export interface PreferenceAttributes {
  id: number;
  listView: LIST_VIEW;
  timeFormat: TIME_FORMAT;
  dateFormat: DATE_FORMAT;
  itemsPerPage: ITEMS_PER_PAGE;
  listOutlineBorders: boolean;
  UserId: number;
}

export type PreferenceCreationAttributes = Optional<PreferenceAttributes, 'id'>;

export class Preference extends Model<PreferenceAttributes, PreferenceCreationAttributes> {
  public id!: number;
  public listView!: LIST_VIEW;
  public timeFormat!: TIME_FORMAT;
  public dateFormat!: DATE_FORMAT;
  public itemsPerPage!: ITEMS_PER_PAGE;
  public listOutlineBorders!: boolean;

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

export const preferenceFactory = (sequelize: Sequelize): Model => {
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
        values: enumToArray(LIST_VIEW),
        allowNull: false,
        defaultValue: LIST_VIEW.LIST
      },
      timeFormat: {
        type: DataTypes.ENUM,
        values: enumToArray(TIME_FORMAT),
        allowNull: false,
        defaultValue: TIME_FORMAT.LONG_TIME
      },
      dateFormat: {
        type: DataTypes.ENUM,
        values: enumToArray(DATE_FORMAT),
        allowNull: false,
        defaultValue: DATE_FORMAT.FULL_DATE
      },
      itemsPerPage: {
        type: DataTypes.ENUM,
        values: enumToArray(ITEMS_PER_PAGE),
        allowNull: false,
        defaultValue: ITEMS_PER_PAGE.FIVE
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
