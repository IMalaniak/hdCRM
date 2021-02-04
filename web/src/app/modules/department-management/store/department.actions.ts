import { createAction, props } from '@ngrx/store';

import { Department } from '@/core/modules/department-api/shared';

const detailsPrefix = '[Department Details]';

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);

export const cacheDepartment = createAction(`${detailsPrefix} Cache Department`, props<{ id: number }>());
export const departmentCached = createAction(
  `${detailsPrefix} Department Cached`,
  props<{ displayedItemCopy: Department }>()
);
export const restoreFromCache = createAction(`${detailsPrefix} Restore Department From Cache`);
