import { createSelector } from '@ngrx/store';

import { AppState } from '..';

import * as fromForms from './dynamic-form.reducer';

export const selectDynamicFormState = (state: AppState) => state.forms;

export const selectFormByName = (formName: string) =>
  createSelector(selectDynamicFormState, (formsState) => formsState.entities[formName]);

export const selectFormIds = createSelector(selectDynamicFormState, fromForms.selectIds);
