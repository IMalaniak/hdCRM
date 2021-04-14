import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { denormalize } from 'normalizr';

import { Department } from '@core/modules/department-api/shared';
import { selectAllDepartmentEntities } from '@core/modules/department-api/store';
import { selectAllUserEntities } from '@core/modules/user-api/store';
import { departmentListSchema } from '@core/store/normalization';
import { PageQuery } from '@shared/models';
import { ListState, Page } from '@shared/store';
import { generatePageKey } from '@shared/utils/generatePageKey';

import * as fromDepartment from './department.reducer';

export const selectDepartmentsState = createFeatureSelector<ListState<Department>>(
  fromDepartment.departmentsFeatureKey
);
export const selectDepartmentPagesState = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState?.pages
);

export const selectDepartmentPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectDepartmentPagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectDepartmentsPageLoading = createSelector(
  selectDepartmentPagesState,
  (pagesState) => pagesState?.pageLoading
);

export const selectDepartmentsTotalCount = createSelector(
  selectDepartmentPagesState,
  (departmentsState) => departmentsState?.resultsNum
);

export const selectDepartmentsOfPage = (pageQuery: PageQuery) =>
  createSelector(
    selectAllDepartmentEntities,
    selectDepartmentPageByKey(pageQuery),
    selectAllUserEntities,
    (departmentEntities: Dictionary<Department>, page: Page, userEntities) =>
      page
        ? (denormalize(page.dataIds, departmentListSchema, {
            Users: userEntities,
            Departments: departmentEntities
          }) as Department[])
        : []
  );

export const selectIsEditing = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState?.isEditing
);

export const selectDepartmentFromCache = createSelector(
  selectDepartmentsState,
  (departmentsState) => departmentsState.cache.displayedItemCopy
);
