import {
  Sequelize,
  Model,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  Association
} from 'sequelize';
import { enumToArray } from '../utils/EnumToArray';
import { User } from './User';

export enum IListView {
  LIST = 'list',
  CARD = 'card'
}

export enum ITimeFormat {
  SHORT_TIME = 'h:mm a',
  MEDIUM_TIME = 'h:mm:ss a',
  LONG_TIME = 'h:mm:ss a z'
}

export enum IDateFormat {
  SHORT_DATE = 'M/d/yy',
  MEDIUM_DATE = 'MMM d, y',
  LONG_DATE = 'MMMM d, y',
  FULL_DATE = 'EEEE, MMMM d, y'
}

export enum IItemsPerPage {
  FIVE = '5',
  TEN = '10',
  FIFTEEN = '15'
}

export class Preference extends Model {
  public id!: number;
  public listView!: IListView;
  public timeFormat!: ITimeFormat;
  public dateFormat!: IDateFormat;
  public itemsPerPage!: IItemsPerPage;

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

export const PreferenceFactory = (sequelize: Sequelize): void => {
  const preferences = Preference.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
      }
    },
    {
      tableName: 'Preferences',
      sequelize
    }
  );

  return preferences;
};
