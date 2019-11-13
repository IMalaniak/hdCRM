import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Department, DepartmentServerResponse } from '../_models';
import { PageQuery } from '@/core/_models';

export enum DepartmentActionTypes {
  DEPARTMENT_REQUESTED = '[Department Details] Department Requested',
  DEPARTMENT_LOADED = '[Departments API] Department Loaded',
  DEPARTMENT_SAVED = '[Department Details] Department Changes Saved',
  DEPARTMENT_CREATE = '[Add Department] Add Department Requested',
  DEPARTMENT_CREATE_SUCCESS = '[Departments API] Add Department Success',
  DEPARTMENT_CREATE_FAIL = '[Departments API] Add Department Fail',
  DELETE_DEPARTMENT = '[Department List] Delete Department Requested',
  DEPARTMENT_LIST_PAGE_REQUESTED = '[Departments List] Departments Page Requested',
  DEPARTMENT_LIST_PAGE_LOADED = '[Departments API] Departments Page Loaded',
  DEPARTMENT_LIST_PAGE_CANCELLED = '[Departments API] Departments Page Cancelled',
  DEPARTMENT_DASHBOARD_DATA_REQUESTED = '[Dashboard] Department Data Requested',
  DEPARTMENT_DASHBOARD_DATA_LOADED = '[Dashboard] Department Data Loaded'
}

export class DepartmentRequested implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_REQUESTED;
  constructor(public payload: { departmentId: number }) {}
}

export class DepartmentLoaded implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_LOADED;
  constructor(public payload: { department: Department }) {}
}

export class DepartmentSaved implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_SAVED;
  constructor(public payload: { department: Update<Department> }) {}
}

export class CreateDepartment implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_CREATE;
  constructor(public payload: { department: Department }) {}
}

export class CreateDepartmentSuccess implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_CREATE_SUCCESS;
  constructor(public payload: { department: Department }) {}
}

export class CreateDepartmentFail implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_CREATE_FAIL;
  constructor(public payload: string) {}
}

export class DeleteDepartment implements Action {
  readonly type = DepartmentActionTypes.DELETE_DEPARTMENT;
  constructor(public payload: { departmentId: number }) {}
}

export class ListPageRequested implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_LIST_PAGE_REQUESTED;
  constructor(public payload: { page: PageQuery }) {}
}

export class ListPageLoaded implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_LIST_PAGE_LOADED;
  constructor(public payload: DepartmentServerResponse) {}
}

export class ListPageCancelled implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_LIST_PAGE_CANCELLED;
}

export class DepDashboardDataRequested implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_DASHBOARD_DATA_REQUESTED;
}

export class DepDashboardDataLoaded implements Action {
  readonly type = DepartmentActionTypes.DEPARTMENT_DASHBOARD_DATA_LOADED;
  constructor(public payload: DepartmentServerResponse) {}
}

export type DepartmentActions =
  | DepartmentRequested
  | DepartmentLoaded
  | DepartmentSaved
  | CreateDepartment
  | CreateDepartmentSuccess
  | CreateDepartmentFail
  | DeleteDepartment
  | ListPageRequested
  | ListPageLoaded
  | ListPageCancelled
  | DepDashboardDataRequested
  | DepDashboardDataLoaded;
