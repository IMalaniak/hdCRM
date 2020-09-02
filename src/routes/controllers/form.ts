import { OK } from 'http-status-codes';
import { Controller, Middleware, Get } from '@overnightjs/core';
import { Response } from 'express';
import { Logger } from '@overnightjs/logger';
import { State } from '../../models';
import Passport from '../../config/passport';
import { RequestWithQuery } from 'src/models/apiRequest';
import { ItemApiResponse } from 'src/models/apiResponse';

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
  private async getOne(req: RequestWithQuery<{ formName: string }>, res: Response<ItemApiResponse<DynamicForm>>) {
    const { formName } = req.params;
    Logger.Info(`Selecting ${formName} form...`);

    const states = await State.findAll();

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
            options: states.map(state => {
              return {
                label: state.keyString,
                value: state.id
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

    const form = forms.find(form => form.formName === formName);

    res.status(OK).json({ success: true, data: form });
  }
}
