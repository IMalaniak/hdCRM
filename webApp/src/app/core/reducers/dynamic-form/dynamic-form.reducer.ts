import * as dynamicFormActions from './dynamic-form.actions';
import { createReducer, on, Action } from '@ngrx/store';
import { IFieldType } from '@/shared/models/FieldType';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface DynamicFormItemOption<T> {
  value: T;
  label: string;
}

export interface DynamicFormItem {
  type: IFieldType;
  label: string;
  isEditable: boolean;
  required: boolean;
  color?: string;
  options?: DynamicFormItemOption<boolean | number | string>[];
  multiple?: boolean;
}

export interface DymanicForm {
  formName: string;
  formItems: DynamicFormItem[];
}

export interface DynamicFormState extends EntityState<DymanicForm> {
  isLoading: boolean;
}

export function selectFormId(a: DymanicForm): string {
  return a.formName;
}
const adapter: EntityAdapter<DymanicForm> = createEntityAdapter<DymanicForm>({
  selectId: selectFormId
});

const initialState: DynamicFormState = adapter.getInitialState({
  isLoading: false
});

const dynamicFormReducer = createReducer(
  initialState,
  on(dynamicFormActions.formRequested, state => ({ ...state, isLoading: true })),
  on(dynamicFormActions.formLoaded, (state, { form }) =>
    adapter.addOne(form, {
      ...state,
      isLoading: false
    })
  ),
  on(dynamicFormActions.formsApiError, state => ({ ...state, isLoading: false }))
);

export function reducer(state: DynamicFormState | undefined, action: Action) {
  return dynamicFormReducer(state, action);
}
