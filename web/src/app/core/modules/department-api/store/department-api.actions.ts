import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { PageQuery, CollectionApiResponse } from '@/shared/models';
import { Page } from '@/shared/store';

import { Department } from '../shared/models';

const detailsPrefix = '[Department Details]';
const listPrefix = '[Departments List]';
const apiPrefix = '[Departments API]';

export const departmentRequested = createAction(`${detailsPrefix} Department Requested`, props<{ id: number }>());
export const departmentLoaded = createAction(`${apiPrefix} Department Loaded`, props<{ department: Department }>());

export const updateDepartmentRequested = createAction(
  `${detailsPrefix} Update Department Requsted`,
  props<{ department: Department }>()
);
export const updateDepartmentSuccess = createAction(
  `${apiPrefix} Update Department Success`,
  props<{ department: Update<Department> }>()
);

export const createDepartmentRequested = createAction(
  '[Add Department] Add Department Requested',
  props<{ department: Department }>()
);
export const createDepartmentSuccess = createAction(
  `${apiPrefix} Add Department Success`,
  props<{ department: Department }>()
);

export const deleteDepartmentRequested = createAction(
  `${listPrefix} Delete Department Requested`,
  props<{ id: number }>()
);
export const deleteDepartmentSuccess = createAction(`${apiPrefix} Delete Department Success`, props<{ id: number }>());

export const listPageRequested = createAction(`${listPrefix} Departments Page Requested`, props<{ page: PageQuery }>());
export const listPageLoaded = createAction(
  `${apiPrefix} Departments Page Loaded`,
  props<{ response: CollectionApiResponse<Department>; page: Page }>()
);

export const depDashboardDataRequested = createAction('[Dashboard] Department Data Requested');
export const depDashboardDataLoaded = createAction(
  '[Dashboard] Department Data Loaded',
  props<{ response: CollectionApiResponse<Department> }>()
);

export const departmentApiError = createAction(`${apiPrefix} Failed Executing Request`);
