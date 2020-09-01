import { IFieldType } from './FieldType';

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

export interface DymanicForm {
  formName: string;
  formItems: DynamicFormItem[];
}
