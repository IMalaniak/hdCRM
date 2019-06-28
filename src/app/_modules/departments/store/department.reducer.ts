import { Action } from '@ngrx/store';
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

    case DepartmentActionTypes.CreateDepartmentSuccess:
      return adapter.addOne(action.payload.department, state);

    case DepartmentActionTypes.CreateDepartmentFail:
      return {
        ...state,
        error: action.payload
      };

    case DepartmentActionTypes.DepartmentLoaded:
      return adapter.addOne(action.payload.department, state);

    case DepartmentActionTypes.ListPageRequested:
      return {
        ...state,
        loading: true
      };

    case DepartmentActionTypes.ListPageLoaded:
      return adapter.upsertMany(action.payload.list, {...state, loading: false, pages: action.payload.pages, countAll: action.payload.count});

    case DepartmentActionTypes.ListPageCancelled:
      return {
        ...state,
        loading: false
      };

    case DepartmentActionTypes.DepartmentSaved:
      return adapter.updateOne(action.payload.department, state);

    case DepartmentActionTypes.DepDashboardDataLoaded:
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
