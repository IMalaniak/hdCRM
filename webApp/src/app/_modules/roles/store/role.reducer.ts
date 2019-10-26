import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Role } from '../_models';
import { RoleActions, RoleActionTypes } from './role.actions';


export interface RolesState extends EntityState<Role> {
  loading: boolean;
  pages: number;
  countAll: number;
  dashboardDataLoaded: boolean;
  error: string;
}

export const adapter: EntityAdapter<Role> = createEntityAdapter<Role>({
});


export const initialRolesState: RolesState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  dashboardDataLoaded: false,
  error: null
});


export function rolesReducer(state = initialRolesState , action: RoleActions): RolesState {

  switch (action.type) {

    case RoleActionTypes.ROLE_CREATE_SUCCESS:
      return adapter.addOne(action.payload.role, {...state, countAll: state.countAll + 1});

    case RoleActionTypes.ROLE_CREATE_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case RoleActionTypes.ROLE_LOADED:
      return adapter.addOne(action.payload.role, state);

    case RoleActionTypes.ROLES_LIST_PAGE_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case RoleActionTypes.ROLES_LIST_PAGE_LOADED:
      return adapter.upsertMany(action.payload.list, {...state, loading: false, pages: action.payload.pages, countAll: action.payload.count});

    case RoleActionTypes.ROLES_LIST_PAGE_CANCELLED:
      return {
        ...state,
        loading: false
      };

    case RoleActionTypes.DELETE_ROLE:
      return adapter.removeOne(action.payload.roleId, {...state, countAll: state.countAll - 1});

    case RoleActionTypes.ROLE_SAVED:
      return adapter.updateOne(action.payload.role, state);

    case RoleActionTypes.ROLE_DASHBOARD_DATA_LOADED:
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
