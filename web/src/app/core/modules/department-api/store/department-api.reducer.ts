import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Department } from '../shared/models';
import * as departmentApiActions from './department-api.actions';

export interface DepartmentApiState extends EntityState<Department> {
  dashboardDataLoaded: boolean;
  loading: boolean;
}

const departmentsAdapter: EntityAdapter<Department> = createEntityAdapter<Department>({
  sortComparer: false
});

export const initialDepartmentApiState: DepartmentApiState = departmentsAdapter.getInitialState({
  dashboardDataLoaded: false,
  loading: false
});

const reducer = createReducer(
  initialDepartmentApiState,
  on(
    departmentApiActions.createDepartmentRequested,
    departmentApiActions.updateDepartmentRequested,
    departmentApiActions.deleteDepartmentRequested,
    departmentApiActions.listPageRequested,
    departmentApiActions.departmentRequested,
    departmentApiActions.depDashboardDataRequested,
    (state) => ({ ...state, loading: true })
  ),
  on(departmentApiActions.createDepartmentSuccess, (state, { department }) =>
    departmentsAdapter.addOne(department, {
      ...state,
      loading: false
    })
  ),
  on(departmentApiActions.deleteDepartmentSuccess, (state, { id }) =>
    departmentsAdapter.removeOne(id, {
      ...state,
      loading: false
    })
  ),
  on(departmentApiActions.departmentLoaded, (state, { department }) =>
    departmentsAdapter.addOne(department, {
      ...state,
      loading: false
    })
  ),
  on(departmentApiActions.listPageLoaded, (state, { response: { data } }) =>
    departmentsAdapter.upsertMany(data, {
      ...state,
      loading: false
    })
  ),
  on(departmentApiActions.updateDepartmentSuccess, (state, { department }) =>
    departmentsAdapter.updateOne(department, {
      ...state,
      loading: false
    })
  ),
  on(departmentApiActions.depDashboardDataLoaded, (state, { response: { data } }) =>
    departmentsAdapter.upsertMany(data, {
      ...state,
      loading: false,
      dashboardDataLoaded: true
    })
  ),
  on(departmentApiActions.departmentApiError, (state) => ({
    ...state,
    loading: false
  }))
);

export function departmentReducer(state: DepartmentApiState | undefined, action: Action) {
  return reducer(state, action);
}

export const departmentsFeatureKey = 'department-api';

export const { selectAll, selectEntities, selectIds, selectTotal } = departmentsAdapter.getSelectors();
