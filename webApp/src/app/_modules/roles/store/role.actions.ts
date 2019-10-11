import { Action } from '@ngrx/store';
import { Role, RoleServerResponse, PrivilegeServerResponse, Privilege } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export enum RoleActionTypes {
  ROLE_REQUESTED = '[Role Details] Role Requested',
  ROLE_LOADED = '[Roles API] Role Loaded',
  ROLE_SAVED = '[Role Details] Role Changes Saved',
  ROLES_LIST_PAGE_REQUESTED = '[Roles List] Roles Page Requested',
  ROLES_LIST_PAGE_LOADED = '[Roles API] Roles Page Loaded',
  ROLES_LIST_PAGE_CANCELLED = '[Roles API] Roles Page Cancelled',
  PRIVILEGE_CREATE = '[Privileges Dialog Window] New Privilege Creation Initialized',
  PRIVILEGE_CREATE_SUCCESS = '[Privileges API] Create Privilege Success',
  PRIVILEGE_CREATE_FAIL = '[Privileges API] Create Privilege Fail',
  ALLPRIVILEGES_REQUESTED = '[Privileges List] Privileges List Requested',
  ALLPRIVILEGES_LOADED = '[Privileges API] Privileges List Loaded',
  PRIVILEGE_SAVED = '[Privileges Dialog Window] Privilege Saved'
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

export class AllPrivilegesRequested implements Action {
  readonly type = RoleActionTypes.ALLPRIVILEGES_REQUESTED;
}

export class AllPrivilegesLoaded implements Action {
  readonly type = RoleActionTypes.ALLPRIVILEGES_LOADED;
  constructor(public payload: PrivilegeServerResponse) {}
}

export class PrivilegeSaved implements Action {
  readonly type = RoleActionTypes.PRIVILEGE_SAVED;
  constructor(public payload: {privilege: Update<Privilege>}) {}
}

export class CreatePrivilege implements Action {
  readonly type = RoleActionTypes.PRIVILEGE_CREATE;
  constructor(public payload: {privilege: Privilege}) {}
}

export class CreatePrivilegeSuccess implements Action {
  readonly type = RoleActionTypes.PRIVILEGE_CREATE_SUCCESS;

  constructor(public payload: {privilege: Privilege}) { }
}

export class CreatePrivilegeFail implements Action {
  readonly type = RoleActionTypes.PRIVILEGE_CREATE_FAIL;

  constructor(public payload: string) { }
}

export type RoleActions = RoleRequested
  | RoleLoaded
  | RoleSaved
  | RolesListPageRequested
  | RolesListPageLoaded
  | RolesListPageCancelled
  | AllPrivilegesRequested
  | AllPrivilegesLoaded
  | PrivilegeSaved
  | CreatePrivilege
  | CreatePrivilegeSuccess
  | CreatePrivilegeFail;
