import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Department } from '../models';
import * as departmentActions from './department.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface DepartmentsState extends EntityState<Department> {
  loading: boolean;
  pages: number;
  editing: boolean;
  countAll: number;
  dashboardDataLoaded: boolean;
}

const adapter: EntityAdapter<Department> = createEntityAdapter<Department>({});

export const initialDepartmentsState: DepartmentsState = adapter.getInitialState({
  loading: false,
  pages: null,
  editing: false,
  countAll: null,
  dashboardDataLoaded: false
});

const departmentsReducer = createReducer(
  initialDepartmentsState,
  on(departmentActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(
    departmentActions.createDepartmentRequested,
    departmentActions.listPageRequested,
    departmentActions.updateDepartmentRequested,
    departmentActions.deleteDepartmentRequested,
    (state) => ({ ...state, loading: true })
  ),
  on(departmentActions.createDepartmentSuccess, (state, { department }) =>
    adapter.addOne(department, {
      ...state,
      countAll: state.countAll + 1,
      loading: false
    })
  ),
  on(departmentActions.deleteDepartmentSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1,
      loading: false
    })
  ),
  on(departmentActions.departmentLoaded, (state, { department }) => adapter.addOne(department, state)),
  on(departmentActions.listPageLoaded, (state, { response }) =>
    adapter.upsertMany(response.data, {
      ...state,
      loading: false,
      pages: response.pages,
      countAll: response.resultsNum
    })
  ),
  on(departmentActions.updateDepartmentSuccess, (state, { department }) =>
    adapter.updateOne(department, { ...state, loading: false, editing: false })
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
