import { createAction, props } from '@ngrx/store';
import { DymanicForm } from '@/shared/models';

export const formRequested = createAction('[Forms] Form Requested', props<{ formName: string }>());
export const formLoaded = createAction('[Forms API] Form Loaded', props<{ form: DymanicForm }>());

export const formsApiError = createAction('[Forms API] Failed To Execute Request');
