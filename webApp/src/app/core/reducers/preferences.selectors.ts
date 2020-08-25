/* NgRx */
import { createSelector } from '@ngrx/store';
import { AppState } from '../reducers/index';

// Selector functions
export const getPreferencesState = (state: AppState) => state.preferences;
export const getListLoaded = createSelector(getPreferencesState, state => state.listLoaded);
export const getPreferencesList = createSelector(getPreferencesState, state => state.list);
export const getDateFormatState = createSelector(getPreferencesState, state => state.dateFormat);
export const getTimeFormatState = createSelector(getPreferencesState, state => state.timeFormat);
