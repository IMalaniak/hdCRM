import { createAction, props } from '@ngrx/store';

import { Plan } from '@core/modules/plan-api/shared';

const detailsPrefix = '[Plan Details]';

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);

export const cachePlan = createAction(`${detailsPrefix} Cache Plan`, props<{ id: number }>());
export const planCached = createAction(`${detailsPrefix} Plan Cached`, props<{ displayedItemCopy: Plan }>());
export const restoreFromCache = createAction(`${detailsPrefix} Restore Plan From Cache`);
