import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Department } from '../models';
import { PageQuery, CollectionApiResponse } from '@/shared';

export const departmentRequested = createAction('[Department Details] Department Requested', props<{ id: number }>());

export const departmentLoaded = createAction(
  '[Departments API] Department Loaded',
  props<{ department: Department }>()
);

export const updateDepartmentRequested = createAction(
  '[Department Details] Update Department Requsted',
  props<{ department: Department }>()
);

export const updateDepartmentSuccess = createAction(
  '[Department API] Update Department Success',
  props<{ department: Update<Department> }>()
);

export const createDepartmentRequested = createAction(
  '[Add Department] Add Department Requested',
  props<{ department: Department }>()
);

export const createDepartmentSuccess = createAction(
  '[Departments API] Add Department Success',
  props<{ department: Department }>()
);

export const deleteDepartment = createAction('[Department List] Delete Department Requested', props<{ id: number }>());

export const listPageRequested = createAction(
  '[Departments List] Departments Page Requested',
  props<{ page: PageQuery }>()
);

export const listPageLoaded = createAction(
  '[Departments API] Departments Page Loaded',
  props<{ response: CollectionApiResponse<Department> }>()
);

export const depDashboardDataRequested = createAction('[Dashboard] Department Data Requested');

export const depDashboardDataLoaded = createAction(
  '[Dashboard] Department Data Loaded',
  props<{ response: CollectionApiResponse<Department> }>()
);

export const departmentApiError = createAction('[Departments API] Failed Executing Request');
