import { StatusCodes } from 'http-status-codes';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Response } from 'express';
import { Logger } from '@overnightjs/logger';
import Passport from '../../config/passport';
import { RequestWithQuery } from '../../models/apiRequest';
import { ItemApiResponse } from '../../models/apiResponse';
import { enumToArray } from '../../utils/EnumToArray';
import { UserState } from '../../constants/UserState';

export enum IFieldType {
  INPUT = 'input',
  SELECT = 'select',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  RADIOGROUP = 'radiogroup',
  DATE = 'date'
}

export interface DynamicFormItemOption {
  value: boolean | number | string;
  label: string;
}

export interface DynamicFormItem {
  controlName: string;
  type: IFieldType;
  label: string;
  isEditable: boolean;
  editOnly?: boolean;
  required?: boolean;
  color?: string;
  options?: DynamicFormItemOption[];
  multiple?: boolean;
}

export interface DynamicForm {
  formName: string;
  formItems: DynamicFormItem[];
}

@Controller('forms/')
export class FormController {
  @Get(':formName')
  @Middleware([Passport.authenticate()])
  async getOne(req: RequestWithQuery<{ formName: string }>, res: Response<ItemApiResponse<DynamicForm>>) {
    const { formName } = req.params;
    Logger.Info(`Selecting ${formName} form...`);

    const states = enumToArray(UserState);

    const forms: DynamicForm[] = [
      {
        formName: 'user',
        formItems: [
          {
            controlName: 'name',
            type: IFieldType.INPUT,
            label: 'Name',
            isEditable: true,
            required: true
          },
          {
            controlName: 'surname',
            type: IFieldType.INPUT,
            label: 'Surname',
            isEditable: true
          },
          {
            controlName: 'login',
            type: IFieldType.INPUT,
            label: 'Login',
            isEditable: false,
            required: true
          },
          {
            controlName: 'email',
            type: IFieldType.INPUT,
            label: 'Email',
            isEditable: true
          },
          {
            controlName: 'phone',
            type: IFieldType.INPUT,
            label: 'Phone',
            isEditable: true
          },
          {
            controlName: 'StateId',
            type: IFieldType.SELECT,
            label: 'State',
            isEditable: true,
            editOnly: true,
            options: states.map((state) => {
              return {
                label: state.toUpperCase(),
                value: state
              };
            })
          },
          {
            controlName: 'createdAt',
            type: IFieldType.DATE,
            label: 'Date Created',
            isEditable: false
          },
          {
            controlName: 'updatedAt',
            type: IFieldType.DATE,
            label: 'Date Updated',
            isEditable: false
          }
        ]
      },
      {
        formName: 'plan',
        formItems: [
          {
            controlName: 'title',
            type: IFieldType.INPUT,
            label: 'Title',
            isEditable: true
          },
          {
            controlName: 'description',
            type: IFieldType.TEXTAREA,
            label: 'Description',
            isEditable: true
          },
          {
            controlName: 'budget',
            type: IFieldType.INPUT,
            label: 'Budget',
            isEditable: true
          },
          {
            controlName: 'deadline',
            type: IFieldType.DATE,
            label: 'Deadline',
            isEditable: true
          },
          {
            controlName: 'createdAt',
            type: IFieldType.DATE,
            label: 'Date Created',
            isEditable: false
          },
          {
            controlName: 'updatedAt',
            type: IFieldType.DATE,
            label: 'Date Updated',
            isEditable: false
          }
        ]
      }
    ];

    const form = forms.find((formItem) => formItem.formName === formName);

    res.status(StatusCodes.OK).json({ success: true, data: form });
  }
}
