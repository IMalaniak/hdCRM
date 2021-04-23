import { ThemePalette } from '@angular/material/core';

import { FORM_TYPE, FIELD_TYPE } from '../constants';

import { TimeStamps } from './base';

export interface DynamicFormItemOption {
  value: boolean | number | string;
  label: string;
}

export interface DynamicFormItem {
  controlName: string;
  type: FIELD_TYPE;
  label: string;
  isEditable: boolean;
  editOnly?: boolean;
  required?: boolean;
  color?: ThemePalette;
  options?: DynamicFormItemOption[];
  multiple?: boolean;
}

export interface DynamicForm extends TimeStamps {
  key: string;
  name: string;
  type: FORM_TYPE;
  form: DynamicFormItem[];
}
