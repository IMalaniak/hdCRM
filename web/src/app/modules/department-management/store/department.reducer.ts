import { createReducer, on, Action } from '@ngrx/store';
import * as departmentApiActions from '@/core/modules/department-api/store/department-api.actions';
import { Department } from '@/core/modules/department-api/shared';
import { initialListState, ListState, pagesAdapter } from '@/shared/store';

import * as departmentActions from './department.actions';

const reducer = createReducer(
  initialListState,
  on(departmentActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    isEditing
  })),
  on(departmentActions.departmentCached, (state, { displayedItemCopy }) => ({
    ...state,
    cache: {
      ...state.cache,
      displayedItemCopy
    }
  })),
  on(departmentApiActions.listPageRequested, (state) => ({
    ...state,
    pages: {
      ...state.pages,
      pageLoading: true
    }
  })),
  on(departmentApiActions.createDepartmentSuccess, (state) => ({
    ...state,
    pages: initialListState.pages
  })),
  on(departmentApiActions.deleteDepartmentSuccess, (state) => ({
    ...state,
    pages: initialListState.pages
  })),
  on(departmentApiActions.updateDepartmentSuccess, (state) => ({ ...state, isEditing: false })),
  on(departmentApiActions.listPageLoaded, (state, { page, response: { pages, resultsNum } }) => ({
    ...state,
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(departmentApiActions.departmentApiError, (state) => ({
    ...state,
    pages: { ...state.pages, pageLoading: false }
  }))
);

export const departmentReducer = (state: ListState<Department> | undefined, action: Action) => reducer(state, action);

export const departmentsFeatureKey = 'department-management';
