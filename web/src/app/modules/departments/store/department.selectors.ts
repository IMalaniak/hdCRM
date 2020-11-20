import { createFeatureSelector, createSelector } from '@ngrx/store';

import { denormalize } from 'normalizr';

import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { departmentListSchema, departmentSchema, Page } from '@/shared/store';
import { selectAllUserEntities } from '@/modules/users/store/user.selectors';
import * as fromDepartment from './department.reducer';
import { Department } from '../models';
import { Dictionary } from '@ngrx/entity';

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
    selectAllDepartmentIds,
    selectAllDepartmentEntities,
    selectDepartmentPageByKey(pageQuery),
    selectAllUserEntities,
    (departmentIds: number[], departmentEntities: Dictionary<Department>, page: Page, userEntities) => {
      if (!page) {
        return [];
      } else {
        const departmentList: Department[] = denormalize(departmentIds, departmentListSchema, {
          Users: userEntities,
          Departments: departmentEntities
        });
        return page.dataIds.map((id) => departmentList.find((department) => department.id === id));
      }
    }
  );

export const selectDashboardDepDataLoaded = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.dashboardDataLoaded
);

export const selectIsEditing = createSelector(selectDepartmentsState, (departmentsState) => departmentsState.editing);
