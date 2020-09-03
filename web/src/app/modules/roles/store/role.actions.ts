import { createAction, props } from '@ngrx/store';
import { Role } from '../models';
import { Update } from '@ngrx/entity';
import { PageQuery, CollectionApiResponse } from '@/shared';

export const createRole = createAction('[Roles Add] Role Add Requested', props<{ role: Role }>());
export const createRoleSuccess = createAction('[Roles API] Add Role Success', props<{ role: Role }>());

export const roleRequested = createAction('[Role Details] Role Requested', props<{ id: number }>());
export const roleLoaded = createAction('[Roles API] Role Loaded', props<{ role: Role }>());

export const roleSaved = createAction('[Role Details] Role Changes Saved', props<{ role: Update<Role> }>());

export const deleteRole = createAction('[Role List] Delete Role Requested', props<{ id: number }>());

export const listPageRequested = createAction('[Roles List] Roles Page Requested', props<{ page: PageQuery }>());
export const listPageLoaded = createAction(
  '[Roles API] Roles Page Loaded',
  props<{ response: CollectionApiResponse<Role> }>()
);

export const roleDashboardDataRequested = createAction('[Dashboard] Roles Data Requested');
export const roleDashboardDataLoaded = createAction(
  '[Roles API] Dashboard Roles Data Loaded',
  props<{ response: CollectionApiResponse<Role> }>()
);

export const rolesApiError = createAction('[Roles API] Failed Executing Request');
