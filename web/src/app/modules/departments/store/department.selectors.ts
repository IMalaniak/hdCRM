import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { Page } from '@/shared/store';
import * as fromDepartment from './department.reducer';
import { Department } from '../models';

export const selectDepartmentsState = createFeatureSelector<fromDepartment.DepartmentsState>(
  fromDepartment.departmentsFeatureKey
);
export const selectDepartmentEntityState = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.data
);
export const selectDepartmentPagesState = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.pages
);

export const selectDepartmentById = (departmentId: number) =>
  createSelector(selectDepartmentEntityState, (departmentsState) => departmentsState.entities[departmentId]);
export const selectDepartmentPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectDepartmentPagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectAllDepartments = createSelector(selectDepartmentEntityState, fromDepartment.selectAll);

export const selectDepartmentsLoading = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.loading
);
export const selectDepartmentsPageLoading = createSelector(
  selectDepartmentPagesState,
  (pagesState) => pagesState?.pageLoading
);

export const selectDepartmentsPagesCount = createSelector(selectDepartmentPagesState, (pagesState) => pagesState.pages);

export const selectDepartmentsTotalCount = createSelector(
  selectDepartmentPagesState,
  (departmentsState) => departmentsState.resultsNum
);

export const selectDepartmentsOfPage = (pageQuery: PageQuery) =>
  createSelector(
    selectAllDepartments,
    selectDepartmentPageByKey(pageQuery),
    (allDepartments: Department[], page: Page) => {
      return page ? page.dataIds.map((id) => allDepartments.find((department) => department.id === id)) : [];
    }
  );

export const selectDashboardDepDataLoaded = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.dashboardDataLoaded
);

export const selectIsEditing = createSelector(selectDepartmentsState, (departmentsState) => departmentsState.editing);
