import { createAction, props } from '@ngrx/store';
import { IDateFormat, ITimeFormat, IItemsPerPage, IListView, ApiResponse } from '@/shared/models';
import { Preferences, PreferencesList } from './preferences.reducer';

const prefix = '[Preferences]';
const apiPrefix = '[Preferences API]';

export const changeDateFormat = createAction(`${prefix} Change Date Format`, props<{ dateFormat: IDateFormat }>());
export const changeTimeFormat = createAction(`${prefix} Change Time Format`, props<{ timeFormat: ITimeFormat }>());
export const changeItemsPerPage = createAction(
  `${prefix} Change Items Per Page Format`,
  props<{ itemsPerPage: IItemsPerPage }>()
);
export const changeListView = createAction(`${prefix} Change List View Format`, props<{ listView: IListView }>());
export const initPreferences = createAction(
  `${prefix} Init Preferences Settings`,
  props<{ preferences: Preferences }>()
);

export const preferencesListRequested = createAction(`${prefix} Preferences List Requested`);
export const preferencesListLoaded = createAction(
  `${apiPrefix} Preferences List Loaded`,
  props<{ list: PreferencesList }>()
);
export const preferencesListLoadFailed = createAction(
  `${apiPrefix} Preferences List Load Failed`,
  props<{ apiResp: ApiResponse }>()
);
