import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Department, DepartmentServerResponse } from '../_models';
import { PageQuery } from '@/core/_models';

export enum DepartmentActionTypes {
  DepartmentRequested = '[Department Details] Department Requested',
  DepartmentLoaded = '[Departments API] Department Loaded',
  DepartmentSaved = '[Department Details] Department Changes Saved',
  CreateDepartment = '[Add Department] Add Department Requested',
  CreateDepartmentSuccess = '[Departments API] Add Department Success',
  CreateDepartmentFail = '[Departments API] Add Department Fail',
  ListPageRequested = '[Departments List] Departments Page Requested',
  ListPageLoaded = '[Departments API] Departments Page Loaded',
  ListPageCancelled = '[Departments API] Departments Page Cancelled',
  DepDashboardDataRequested = '[Dashboard] Dashboard Data Requested',
  DepDashboardDataLoaded = '[Dashboard] Dashboard Data Loaded'
}

export class DepartmentRequested implements Action {
  readonly type = DepartmentActionTypes.DepartmentRequested;
  constructor(public payload: {departmentId: number}) {}
}

export class DepartmentLoaded implements Action {
  readonly type = DepartmentActionTypes.DepartmentLoaded;
  constructor(public payload: {department: Department}) {}
}

export class DepartmentSaved implements Action {
  readonly type = DepartmentActionTypes.DepartmentSaved;
  constructor(public payload: {department: Update<Department>}) {}
}

export class CreateDepartment implements Action {
  readonly type = DepartmentActionTypes.CreateDepartment;
  constructor(public payload: {department: Department}) {}
}

export class CreateDepartmentSuccess implements Action {
  readonly type = DepartmentActionTypes.CreateDepartmentSuccess;
  constructor(public payload: {department: Department}) { }
}

export class CreateDepartmentFail implements Action {
  readonly type = DepartmentActionTypes.CreateDepartmentFail;
  constructor(public payload: string) { }
}


export class ListPageRequested implements Action {
  readonly type = DepartmentActionTypes.ListPageRequested;
  constructor(public payload: {page: PageQuery}) {}
}

export class ListPageLoaded implements Action {
  readonly type = DepartmentActionTypes.ListPageLoaded;
  constructor(public payload: DepartmentServerResponse) {}
}

export class ListPageCancelled implements Action {
  readonly type = DepartmentActionTypes.ListPageCancelled;
}

export class DepDashboardDataRequested implements Action {
  readonly type = DepartmentActionTypes.DepDashboardDataRequested;
}

export class DepDashboardDataLoaded implements Action {
  readonly type = DepartmentActionTypes.DepDashboardDataLoaded;
  constructor(public payload: DepartmentServerResponse) {}
}

export type DepartmentActions = DepartmentRequested
  | DepartmentLoaded
  | DepartmentSaved
  | CreateDepartment
  | CreateDepartmentSuccess
  | CreateDepartmentFail
  | ListPageRequested
  | ListPageLoaded
  | ListPageCancelled
  | DepDashboardDataRequested
  | DepDashboardDataLoaded;
