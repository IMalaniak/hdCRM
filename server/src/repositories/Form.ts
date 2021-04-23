import { Sequelize, Model, DataTypes } from 'sequelize';

import { FIELD_TYPE, FORM_TYPE, FIELD_COLOR } from '../constants';
import { enumToArray } from '../utils/enumToArray';

export interface FormItemOption {
  value: boolean | number | string;
  label: string;
}

export interface FormItem {
  controlName: string;
  type: FIELD_TYPE;
  label: string;
  isEditable: boolean;
  editOnly?: boolean;
  required?: boolean;
  color?: FIELD_COLOR;
  options?: FormItemOption[];
  multiple?: boolean;
}

export interface FormAttributes {
  key: string;
  name: string;
  type: FORM_TYPE;
  form: FormItem[];
}

export class Form extends Model<FormAttributes> {
  public key!: string;
  public name!: string;
  public type!: FORM_TYPE;
  public form!: FormItem[];

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const formFactory = (sequelize: Sequelize): Model => {
  return Form.init(
    {
      key: {
        primaryKey: true,
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      type: {
        type: DataTypes.ENUM,
        values: enumToArray(FORM_TYPE),
        allowNull: false
      },
      form: {
        type: DataTypes.JSONB,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {
      tableName: 'Forms',
      sequelize
    }
  );
};
