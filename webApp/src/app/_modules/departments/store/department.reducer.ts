import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Department } from '../_models';
import * as departmentActions from './department.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface DepartmentsState extends EntityState<Department> {
  loading: boolean;
  pages: number;
  countAll: number;
  dashboardDataLoaded: boolean;
  error: string;
}

export const adapter: EntityAdapter<Department> = createEntityAdapter<Department>({});

const initialState: DepartmentsState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  dashboardDataLoaded: false,
  error: null
});

const departmentsReducer = createReducer(
  initialState,
  on(departmentActions.createDepartmentSuccess, (state, { department }) =>
    adapter.addOne(department, {
      ...state,
      countAll: state.countAll + 1
    })
  ),
  on(departmentActions.createDepartmentFail, (state, { error }) => ({ ...state, error })),
  on(departmentActions.deleteDepartment, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1
    })
  ),
  on(departmentActions.departmentLoaded, (state, { department }) => adapter.addOne(department, state)),
  on(departmentActions.listPageRequested, state => ({ ...state, loading: true })),
  on(departmentActions.listPageLoaded, (state, { response }) =>
    adapter.upsertMany(response.list, {
      ...state,
      loading: false,
      pages: response.pages,
      countAll: response.count
    })
  ),
  on(departmentActions.listPageCancelled, state => ({ ...state, loading: false })),
  on(departmentActions.departmentSaved, (state, { department }) => adapter.updateOne(department, state)),
  on(departmentActions.depDashboardDataLoaded, (state, { response }) =>
    adapter.upsertMany(response.list, {
      ...state,
      countAll: response.count,
      dashboardDataLoaded: true
    })
  )
);

export function reducer(state: DepartmentsState | undefined, action: Action) {
  return departmentsReducer(state, action);
}

export const departmentsFeatureKey = 'departments';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
