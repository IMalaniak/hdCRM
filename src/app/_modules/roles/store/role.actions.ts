import { Action } from '@ngrx/store';
import { Role, RoleServerResponse } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export enum RoleActionTypes {
  RoleRequested = '[Role Details] Role Requested',
  RoleLoaded = '[Roles API] Role Loaded',
  RoleSaved = '[Role Details] Role Changes Saved',
  RolesListPageRequested = '[Roles List] Roles Page Requested',
  RolesListPageLoaded = '[Roles API] Roles Page Loaded',
  RolesListPageCancelled = '[Roles API] Roles Page Cancelled',
}

export class RoleRequested implements Action {
  readonly type = RoleActionTypes.RoleRequested;
  constructor(public payload: {roleId: number}) {}
}

export class RoleLoaded implements Action {
  readonly type = RoleActionTypes.RoleLoaded;
  constructor(public payload: {role: Role}) {}
}

export class RoleSaved implements Action {
  readonly type = RoleActionTypes.RoleSaved;
  constructor(public payload: {role: Update<Role>}) {}
}

export class RolesListPageRequested implements Action {
  readonly type = RoleActionTypes.RolesListPageRequested;
  constructor(public payload: {page: PageQuery}) {}
}

export class RolesListPageLoaded implements Action {
  readonly type = RoleActionTypes.RolesListPageLoaded;
  constructor(public payload: RoleServerResponse) {}
}

export class RolesListPageCancelled implements Action {
  readonly type = RoleActionTypes.RolesListPageCancelled;
}

export type RoleActions = RoleRequested
  | RoleLoaded
  | RoleSaved
  | RolesListPageRequested
  | RolesListPageLoaded
  | RolesListPageCancelled;
