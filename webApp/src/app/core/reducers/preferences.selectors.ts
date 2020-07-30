/* NgRx */
import { createSelector } from '@ngrx/store';
import { AppState } from '.';

// Selector functions
export const getPreferencesState = (state: AppState) => state.preferences;
export const getListLoaded = createSelector(getPreferencesState, state => state.listLoaded);
export const getPreferencesList = createSelector(getPreferencesState, state => state.list);
