import { createReducer, on, Action } from '@ngrx/store';

import * as departmentApiActions from '@/core/modules/department-api/store/department-api.actions';
import { initialListState, ListState, pagesAdapter } from '@/shared/store';
import * as departmentActions from './department.actions';

const reducer = createReducer(
  initialListState,
  on(departmentActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
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

export function departmentReducer(state: ListState | undefined, action: Action) {
  return reducer(state, action);
}

export const departmentsFeatureKey = 'department-management';
