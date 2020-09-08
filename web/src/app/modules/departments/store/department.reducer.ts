import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Department } from '../models';
import * as departmentActions from './department.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface DepartmentsState extends EntityState<Department> {
  loading: boolean;
  pages: number;
  countAll: number;
  dashboardDataLoaded: boolean;
}

const adapter: EntityAdapter<Department> = createEntityAdapter<Department>({});

const initialState: DepartmentsState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  dashboardDataLoaded: false
});

const departmentsReducer = createReducer(
  initialState,
  on(departmentActions.createDepartmentRequested, (state) => ({ ...state, loading: true })),
  on(departmentActions.createDepartmentSuccess, (state, { department }) =>
    adapter.addOne(department, {
      ...state,
      countAll: state.countAll + 1,
      loading: false
    })
  ),
  on(departmentActions.deleteDepartment, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1
    })
  ),
  on(departmentActions.departmentLoaded, (state, { department }) => adapter.addOne(department, state)),
  on(departmentActions.listPageRequested, (state) => ({ ...state, loading: true })),
  on(departmentActions.listPageLoaded, (state, { response }) =>
    adapter.upsertMany(response.data, {
      ...state,
      loading: false,
      pages: response.pages,
      countAll: response.resultsNum
    })
  ),
  on(departmentActions.updateDepartmentRequested, (state) => ({ ...state, loading: true })),
  on(departmentActions.updateDepartmentSuccess, (state, { department }) =>
    adapter.updateOne(department, { ...state, loading: false })
  ),
  on(departmentActions.depDashboardDataLoaded, (state, { response }) =>
    adapter.upsertMany(response.data, {
      ...state,
      countAll: response.resultsNum,
      dashboardDataLoaded: true
    })
  ),
  on(departmentActions.departmentApiError, (state) => ({ ...state, loading: false }))
);

export function reducer(state: DepartmentsState | undefined, action: Action) {
  return departmentsReducer(state, action);
}

export const departmentsFeatureKey = 'departments';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
