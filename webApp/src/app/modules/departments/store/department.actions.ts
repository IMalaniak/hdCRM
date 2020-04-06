import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Department, DepartmentServerResponse } from '../models';
import { PageQuery } from '@/shared';

export const departmentRequested = createAction(
  '[Department Details] Department Requested',
  props<{ id: number }>()
);

export const departmentLoaded = createAction(
  '[Departments API] Department Loaded',
  props<{ department: Department }>()
);

export const departmentSaved = createAction(
  '[Department Details] Department Changes Saved',
  props<{ department: Update<Department> }>()
);

export const createDepartment = createAction(
  '[Add Department] Add Department Requested',
  props<{ department: Department }>()
);

export const createDepartmentSuccess = createAction(
  '[Departments API] Add Department Success',
  props<{ department: Department }>()
);

export const createDepartmentFail = createAction(
  '[Departments API] Add Department Fail',
  props<{ error: string }>()
);

export const deleteDepartment = createAction(
  '[Department List] Delete Department Requested',
  props<{ id: number }>()
);

export const listPageRequested = createAction(
  '[Departments List] Departments Page Requested',
  props<{ page: PageQuery }>()
);

export const listPageLoaded = createAction(
  '[Departments API] Departments Page Loaded',
  props<{ response: DepartmentServerResponse }>()
);

export const listPageCancelled = createAction(
  '[Departments API] Departments Page Cancelled'
);

export const depDashboardDataRequested = createAction(
  '[Dashboard] Department Data Requested',
);

export const depDashboardDataLoaded = createAction(
  '[Dashboard] Department Data Loaded',
  props<{ response: DepartmentServerResponse }>()
);
