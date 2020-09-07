import { AppState } from '..';
import { createSelector } from '@ngrx/store';

export const selectDynamicFormState = (state: AppState) => state.forms;

export const selectFormByName = (formName: string) =>
  createSelector(selectDynamicFormState, (formsState) => formsState.entities[formName]);
