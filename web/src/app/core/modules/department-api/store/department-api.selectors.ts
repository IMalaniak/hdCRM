import { createFeatureSelector, createSelector } from '@ngrx/store';
import { denormalize } from 'normalizr';
import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { departmentSchema } from '@/core/store/normalization';

import * as fromDepartment from './department-api.reducer';

export const selectDepartmentsState = createFeatureSelector<fromDepartment.DepartmentApiState>(
  fromDepartment.departmentsFeatureKey
);

export const selectDepartmentById = (departmentId: number) =>
  createSelector(selectDepartmentsState, (departmentsState) => departmentsState.entities[departmentId]);
export const selectDepartmentDeepById = (departmentId: number) =>
  createSelector(selectDepartmentById(departmentId), selectAllUserEntities, (department, userEntities) =>
    denormalize(department, departmentSchema, { Users: userEntities })
  );

export const selectAllDepartments = createSelector(selectDepartmentsState, fromDepartment.selectAll);
export const selectAllDepartmentEntities = createSelector(selectDepartmentsState, fromDepartment.selectEntities);
export const selectAllDepartmentIds = createSelector(selectDepartmentsState, fromDepartment.selectIds);

export const selectDepartmentsLoading = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.loading
);

export const selectDashboardDepDataLoaded = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.dashboardDataLoaded
);
