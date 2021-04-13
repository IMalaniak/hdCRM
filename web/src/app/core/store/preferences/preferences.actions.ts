import { createAction, props } from '@ngrx/store';
import { BaseMessage } from '@/shared/models';
import { DATE_FORMAT, TIME_FORMAT, ITEMS_PER_PAGE, LIST_VIEW } from '@/shared/constants';

import { Preferences, PreferencesList } from './preferences.reducer';

const prefix = '[Preferences]';
const apiPrefix = '[Preferences API]';

export const changeDateFormat = createAction(`${prefix} Change Date Format`, props<{ dateFormat: DATE_FORMAT }>());
export const changeTimeFormat = createAction(`${prefix} Change Time Format`, props<{ timeFormat: TIME_FORMAT }>());
export const changeItemsPerPage = createAction(
  `${prefix} Change Items Per Page Format`,
  props<{ itemsPerPage: ITEMS_PER_PAGE }>()
);
export const changeListView = createAction(`${prefix} Change List View Format`, props<{ listView: LIST_VIEW }>());
export const changeListBordersVisibility = createAction(
  `${prefix} Change List Borders Visibility`,
  props<{ isVisible: boolean }>()
);
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
  props<{ apiResp: BaseMessage }>()
);
