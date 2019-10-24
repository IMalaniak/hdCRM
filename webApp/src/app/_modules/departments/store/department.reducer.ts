import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Department } from '../_models';
import { DepartmentActions, DepartmentActionTypes } from './department.actions';


export interface DepartmentsState extends EntityState<Department> {
  loading: boolean;
  pages: number;
  countAll: number;
  dashboardDataLoaded: boolean;
  error: string;
}


export const adapter: EntityAdapter<Department> = createEntityAdapter<Department>({

});


export const initialDepartmentsState: DepartmentsState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  dashboardDataLoaded: false,
  error: null
});


export function departmentsReducer(state = initialDepartmentsState , action: DepartmentActions): DepartmentsState {

  switch (action.type) {

    case DepartmentActionTypes.DEPARTMENT_CREATE_SUCCESS:
      return adapter.addOne(action.payload.department, {...state, countAll: state.countAll + 1});

    case DepartmentActionTypes.DEPARTMENT_CREATE_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case DepartmentActionTypes.DELETE_DEPARTMENT:
      return adapter.removeOne(action.payload.departmentId, {...state, countAll: state.countAll - 1});

    case DepartmentActionTypes.DEPARTMENT_LOADED:
      return adapter.addOne(action.payload.department, state);

    case DepartmentActionTypes.DEPARTMENT_LIST_PAGE_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case DepartmentActionTypes.DEPARTMENT_LIST_PAGE_LOADED:
      return adapter.upsertMany(action.payload.list, {...state, loading: false, pages: action.payload.pages, countAll: action.payload.count});

    case DepartmentActionTypes.DEPARTMENT_LIST_PAGE_CANCELLED:
      return {
        ...state,
        loading: false
      };

    case DepartmentActionTypes.DEPARTMENT_SAVED:
      return adapter.updateOne(action.payload.department, state);

    case DepartmentActionTypes.DEPARTMENT_DASHBOARD_DATA_LOADED:
      return adapter.upsertMany(action.payload.list, {...state, countAll: action.payload.count, dashboardDataLoaded: true});

    default: {
      return state;
    }

  }
}


export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
