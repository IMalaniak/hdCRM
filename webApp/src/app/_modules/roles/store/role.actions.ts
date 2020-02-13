import { createAction, props } from '@ngrx/store';
import { Role, RoleServerResponse } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export const createRole = createAction(
  '[Roles Add] Role Add Requested',
  props<{ role: Role }>()
);

export const createRoleSuccess = createAction(
  '[Roles API] Add Role Success',
  props<{ role: Role }>()
);

export const createRoleFail = createAction(
  '[Roles API] Add Role Fail',
  props<{ error: string }>()
);

export const roleRequested = createAction(
  '[Role Details] Role Requested',
  props<{ id: number }>()
);

export const roleLoaded = createAction(
  '[Roles API] Role Loaded',
  props<{ role: Role }>()
);

export const roleSaved = createAction(
  '[Role Details] Role Changes Saved',
  props<{ role: Update<Role> }>()
);

export const deleteRole = createAction(
  '[Role List] Delete Role Requested',
  props<{ id: number }>()
);

export const listPageRequested = createAction(
  '[Roles List] Roles Page Requested',
  props<{ page: PageQuery }>()
);

export const listPageLoaded = createAction(
  '[Roles API] Roles Page Loaded',
  props<{ response: RoleServerResponse }>()
);

export const listPageCancelled = createAction(
  '[Roles API] Roles Page Cancelled'
);

export const roleDashboardDataRequested = createAction(
  '[Dashboard] Roles Data Requested',
);

export const roleDashboardDataLoaded = createAction(
  '[Dashboard] Roles Data Loaded',
  props<{ response: RoleServerResponse }>()
);
