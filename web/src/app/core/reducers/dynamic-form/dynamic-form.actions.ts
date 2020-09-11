import { createAction, props } from '@ngrx/store';
import { DynamicForm } from '@/shared/models';

const prefix = '[Forms]';
const apiPrefix = '[Forms API]';

export const formRequested = createAction(`${prefix} Form Requested`, props<{ formName: string }>());
export const formLoaded = createAction(`${apiPrefix} Form Loaded`, props<{ form: DynamicForm }>());

export const formsApiError = createAction(`${apiPrefix} Failed To Execute Request`);
