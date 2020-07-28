import { createAction, props } from '@ngrx/store';
import { IDateFormat, ITimeFormat, IItemsPerPage, IListView, ApiResponse } from '@/shared/models';
import { Preferences, PreferencesList } from './preferences.reducer';

export const changeDateFormat = createAction('[Preferences] Change Date Format', props<{ dateFormat: IDateFormat }>());
export const changeTimeFormat = createAction('[Preferences] Change Time Format', props<{ timeFormat: ITimeFormat }>());
export const changeItemsPerPage = createAction(
  '[Preferences] Change Items Per Page Format',
  props<{ itemsPerPage: IItemsPerPage }>()
);
export const changeListView = createAction('[Preferences] Change List View Format', props<{ listView: IListView }>());
export const initPreferences = createAction(
  '[Preferences] Init Preferences Settings',
  props<{ preferences: Preferences }>()
);

export const preferencesListRequested = createAction('[Preferences] Preferences List Requested');
export const preferencesListLoaded = createAction(
  '[Preferences API] Preferences List Loaded',
  props<{ list: PreferencesList }>()
);
export const preferencesListLoadFailed = createAction(
  '[Preferences API] Preferences List Load Failed',
  props<{ apiResp: ApiResponse }>()
);
