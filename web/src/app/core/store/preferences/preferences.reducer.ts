import { createReducer, on, Action } from '@ngrx/store';
import { DATE_FORMAT, ITEMS_PER_PAGE, LIST_VIEW, TIME_FORMAT } from '@/shared/constants';

import * as PreferencesActions from './preferences.actions';


export interface Preferences {
  dateFormat: DATE_FORMAT;
  timeFormat: TIME_FORMAT;
  itemsPerPage: ITEMS_PER_PAGE;
  listView: LIST_VIEW;
  listOutlineBorders: boolean;
}

export interface PreferencesList {
  dateFormat: DATE_FORMAT[];
  timeFormat: TIME_FORMAT[];
  itemsPerPage: ITEMS_PER_PAGE[];
  listView: LIST_VIEW[];
}

export interface PreferencesState extends Preferences {
  listLoaded: boolean;
  list: PreferencesList;
}

export const initialPreferencesState: PreferencesState = {
  dateFormat: DATE_FORMAT.MEDIUM_DATE,
  timeFormat: TIME_FORMAT.MEDIUM_TIME,
  itemsPerPage: ITEMS_PER_PAGE.FIVE,
  listView: LIST_VIEW.LIST,
  listOutlineBorders: true,
  listLoaded: false,
  list: null
};

const reducer = createReducer(
  initialPreferencesState,
  on(PreferencesActions.changeDateFormat, (state, { dateFormat }) => ({ ...state, dateFormat })),
  on(PreferencesActions.changeTimeFormat, (state, { timeFormat }) => ({ ...state, timeFormat })),
  on(PreferencesActions.changeItemsPerPage, (state, { itemsPerPage }) => ({ ...state, itemsPerPage })),
  on(PreferencesActions.changeListView, (state, { listView }) => ({ ...state, listView })),
  on(PreferencesActions.changeListBordersVisibility, (state, { isVisible }) => ({
    ...state,
    listOutlineBorders: isVisible
  })),
  on(PreferencesActions.initPreferences, (state, { preferences }) => ({ ...state, ...preferences })),
  on(PreferencesActions.preferencesListLoaded, (state, { list }) => ({ ...state, list }))
);

export const preferencesReducer = (state: PreferencesState | undefined, action: Action) => reducer(state, action);
