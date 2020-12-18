import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { denormalize } from 'normalizr';

import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { selectAllDepartmentEntities } from '@/core/modules/department-api/store';
import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { departmentListSchema, Page } from '@/shared/store';
import * as fromDepartment from './department.reducer';
import { Department } from '../models';

export const selectDepartmentsState = createFeatureSelector<fromDepartment.DepartmentsState>(
  fromDepartment.departmentsFeatureKey
);
export const selectDepartmentPagesState = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.pages
);

export const selectDepartmentPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectDepartmentPagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

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

export const selectIsEditing = createSelector(selectDepartmentsState, (departmentsState) => departmentsState.editing);
