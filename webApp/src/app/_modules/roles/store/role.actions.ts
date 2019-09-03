import { Action } from '@ngrx/store';
import { Role, RoleServerResponse } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export enum RoleActionTypes {
  ROLE_REQUESTED = '[Role Details] Role Requested',
  ROLE_LOADED = '[Roles API] Role Loaded',
  ROLE_SAVED = '[Role Details] Role Changes Saved',
  ROLES_LIST_PAGE_REQUESTED = '[Roles List] Roles Page Requested',
  ROLES_LIST_PAGE_LOADED = '[Roles API] Roles Page Loaded',
  ROLES_LIST_PAGE_CANCELLED = '[Roles API] Roles Page Cancelled',
}

export class RoleRequested implements Action {
  readonly type = RoleActionTypes.ROLE_REQUESTED;
  constructor(public payload: {roleId: number}) {}
}

export class RoleLoaded implements Action {
  readonly type = RoleActionTypes.ROLE_LOADED;
  constructor(public payload: {role: Role}) {}
}

export class RoleSaved implements Action {
  readonly type = RoleActionTypes.ROLE_SAVED;
  constructor(public payload: {role: Update<Role>}) {}
}

export class RolesListPageRequested implements Action {
  readonly type = RoleActionTypes.ROLES_LIST_PAGE_REQUESTED;
  constructor(public payload: {page: PageQuery}) {}
}

export class RolesListPageLoaded implements Action {
  readonly type = RoleActionTypes.ROLES_LIST_PAGE_LOADED;
  constructor(public payload: RoleServerResponse) {}
}

export class RolesListPageCancelled implements Action {
  readonly type = RoleActionTypes.ROLES_LIST_PAGE_CANCELLED;
}

export type RoleActions = RoleRequested
  | RoleLoaded
  | RoleSaved
  | RolesListPageRequested
  | RolesListPageLoaded
  | RolesListPageCancelled;
