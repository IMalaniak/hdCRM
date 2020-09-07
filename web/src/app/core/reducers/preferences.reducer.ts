import { createReducer, on, Action } from '@ngrx/store';
import * as PreferencesActions from './preferences.actions';

import { IDateFormat, IItemsPerPage, IListView, ITimeFormat } from '@/shared/models';

export interface Preferences {
  dateFormat: IDateFormat;
  timeFormat: ITimeFormat;
  itemsPerPage: IItemsPerPage;
  listView: IListView;
}

export interface PreferencesList {
  dateFormat: IDateFormat[];
  timeFormat: ITimeFormat[];
  itemsPerPage: IItemsPerPage[];
  listView: IListView[];
}

export interface PreferencesState extends Preferences {
  listLoaded: boolean;
  list: PreferencesList;
}

const initialState: PreferencesState = {
  dateFormat: IDateFormat.MEDIUM_DATE,
  timeFormat: ITimeFormat.MEDIUM_TIME,
  itemsPerPage: IItemsPerPage.FIVE,
  listView: IListView.LIST,
  listLoaded: false,
  list: null
};

const preferencesReducer = createReducer(
  initialState,
  on(PreferencesActions.changeDateFormat, (state, { dateFormat }) => ({ ...state, dateFormat })),
  on(PreferencesActions.changeTimeFormat, (state, { timeFormat }) => ({ ...state, timeFormat })),
  on(PreferencesActions.changeItemsPerPage, (state, { itemsPerPage }) => ({ ...state, itemsPerPage })),
  on(PreferencesActions.changeListView, (state, { listView }) => ({ ...state, listView })),
  on(PreferencesActions.initPreferences, (state, { preferences }) => ({ ...state, ...preferences })),
  on(PreferencesActions.preferencesListLoaded, (state, { list }) => ({ ...state, list }))
);

export function reducer(state: PreferencesState | undefined, action: Action) {
  return preferencesReducer(state, action);
}
