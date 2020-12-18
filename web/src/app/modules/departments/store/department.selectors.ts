import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { denormalize } from 'normalizr';

import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { departmentListSchema, departmentSchema, Page } from '@/shared/store';
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
export const selectDepartmentDeepById = (departmentId: number) =>
  createSelector(selectDepartmentById(departmentId), selectAllUserEntities, (department, userEntities) => {
    return denormalize(department, departmentSchema, { Users: userEntities });
  });
export const selectDepartmentPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectDepartmentPagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectAllDepartments = createSelector(selectDepartmentEntityState, fromDepartment.selectAll);
export const selectAllDepartmentEntities = createSelector(selectDepartmentEntityState, fromDepartment.selectEntities);
export const selectAllDepartmentIds = createSelector(selectDepartmentEntityState, fromDepartment.selectIds);

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
    selectAllDepartmentEntities,
    selectDepartmentPageByKey(pageQuery),
    selectAllUserEntities,
    (departmentEntities: Dictionary<Department>, page: Page, userEntities) => {
      return page
        ? (denormalize(page.dataIds, departmentListSchema, {
            Users: userEntities,
            Departments: departmentEntities
          }) as Department[])
        : [];
    }
  );

export const selectDashboardDepDataLoaded = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.dashboardDataLoaded
);

export const selectIsEditing = createSelector(selectDepartmentsState, (departmentsState) => departmentsState.editing);
