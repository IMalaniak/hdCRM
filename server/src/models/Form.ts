import { Sequelize, Model, DataTypes } from 'sequelize';
import { FieldType, FormType } from '../constants';
import { enumToArray } from '../utils/EnumToArray';

export interface FormItemOption {
  value: boolean | number | string;
  label: string;
}

export interface FormItem {
  controlName: string;
  type: FieldType;
  label: string;
  isEditable: boolean;
  editOnly?: boolean;
  required?: boolean;
  color?: string;
  options?: FormItemOption[];
  multiple?: boolean;
}

export interface FormAttributes {
  key: string;
  name: string;
  type: FormType;
  form: FormItem[];
}

export class Form extends Model<FormAttributes> {
  public key!: string;
  public name!: string;
  public type!: FormType;
  public form!: FormItem[];

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const FormFactory = (sequelize: Sequelize): Model => {
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
        values: enumToArray(FormType),
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
