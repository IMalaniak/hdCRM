import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DepartmentsState } from './department.reducer';

import * as fromDepartment from './department.reducer';
import { Department } from '../_models';
import { PageQuery } from '@/core/_models';

export const selectDepartmentsState = createFeatureSelector<DepartmentsState>('departments');

export const selectDepartmentById = (departmentId: number) => createSelector(
    selectDepartmentsState,
    departmentsState => departmentsState.entities[departmentId]
);

export const selectAllDepartments = createSelector(
  selectDepartmentsState,
  fromDepartment.selectAll
);

export const selectDepartmentsLoading = createSelector(
  selectDepartmentsState,
  departmentsState => departmentsState.loading
);

export const selectDepartmentsPagesCount = createSelector(
  selectDepartmentsState,
  departmentsState => departmentsState.pages
);

export const selectDepartmentsTotalCount = createSelector(
  selectDepartmentsState,
  departmentsState => departmentsState.countAll
);

export const selectDepartmentsPage = (page: PageQuery) => createSelector(
  selectAllDepartments,
  selectDepartmentsPagesCount,
  (allDepartments: Department[], pagesCount: number) => {
    if (!pagesCount) {
      return [];
    } else {
      const start = page.pageIndex * page.pageSize,
            end = start + page.pageSize;
      return allDepartments.slice(start, end);
    }
  }
);

export const selectDashboardDepDataLoaded = createSelector(
  selectDepartmentsState,
  departmentsState => departmentsState.dashboardDataLoaded
);
