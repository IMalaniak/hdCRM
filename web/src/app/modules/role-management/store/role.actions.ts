import { createAction, props } from '@ngrx/store';
import { Role } from '@/core/modules/role-api/shared';

const detailsPrefix = '[Role Details]';

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);

export const cacheRole = createAction(`${detailsPrefix} Cache Role`, props<{ id: number }>());
export const roleCached = createAction(`${detailsPrefix} Role Cached`, props<{ displayedItemCopy: Role }>());
export const restoreFromCache = createAction(`${detailsPrefix} Restore Role From Cache`);
