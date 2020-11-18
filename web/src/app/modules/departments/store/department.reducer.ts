import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { getInitialPaginationState, pagesAdapter, PaginationState } from '@/shared/store';
import { Department } from '../models';
import * as departmentActions from './department.actions';

export interface DepartmentsEntityState extends EntityState<Department> {}

export interface DepartmentsState extends PaginationState<DepartmentsEntityState> {
  dashboardDataLoaded: boolean;
}

const departmentsAdapter: EntityAdapter<Department> = createEntityAdapter<Department>({
  sortComparer: false
});

const initialDepartmentsEntityState: DepartmentsEntityState = departmentsAdapter.getInitialState({
  dashboardDataLoaded: false
});

export const initialDepartmentsState: DepartmentsState = getInitialPaginationState<
  DepartmentsEntityState,
  DepartmentsState
>(initialDepartmentsEntityState);

const departmentsReducer = createReducer(
  initialDepartmentsState,
  on(departmentActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(
    departmentActions.createDepartmentRequested,
    departmentActions.updateDepartmentRequested,
    departmentActions.deleteDepartmentRequested,
    (state) => ({ ...state, loading: true })
  ),
  on(departmentActions.listPageRequested, (state) => ({
    ...state,
    pages: {
      ...state.pages,
      pageLoading: true
    }
  })),
  on(departmentActions.createDepartmentSuccess, (state, { department }) => ({
    ...state,
    loading: false,
    data: departmentsAdapter.addOne(department, {
      ...state.data
    })
  })),
  on(departmentActions.deleteDepartmentSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    data: departmentsAdapter.removeOne(id, {
      ...state.data
    })
  })),
  on(departmentActions.departmentLoaded, (state, { department }) => ({
    ...state,
    loading: false,
    data: departmentsAdapter.addOne(department, {
      ...state.data
    })
  })),
  on(departmentActions.listPageLoaded, (state, { page, response: { data, pages, resultsNum } }) => ({
    ...state,
    data: departmentsAdapter.upsertMany(data, {
      ...state.data
    }),
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(departmentActions.updateDepartmentSuccess, (state, { department }) => ({
    ...state,
    loading: false,
    editing: false,
    data: departmentsAdapter.updateOne(department, { ...state.data })
  })),
  on(departmentActions.depDashboardDataLoaded, (state, { response }) => ({
    ...state,
    loading: false,
    data: departmentsAdapter.upsertMany(response.data, {
      ...state.data,
      dashboardDataLoaded: true
    })
  })),
  on(departmentActions.departmentApiError, (state) => ({
    ...state,
    loading: false,
    pages: { ...state.pages, pageLoading: false }
  }))
);

export function reducer(state: DepartmentsState | undefined, action: Action) {
  return departmentsReducer(state, action);
}

export const departmentsFeatureKey = 'departments';

export const { selectAll, selectEntities, selectIds, selectTotal } = departmentsAdapter.getSelectors();
