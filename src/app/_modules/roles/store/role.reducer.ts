import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Role } from '../_models';
import { RoleActions, RoleActionTypes } from './role.actions';


export interface RolesState extends EntityState<Role> {
  loading: boolean;
  pages: number;
  countAll: number;
}

export const adapter: EntityAdapter<Role> = createEntityAdapter<Role>({
});


export const initialRolesState: RolesState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null
});


export function rolesReducer(state = initialRolesState , action: RoleActions): RolesState {

  switch (action.type) {

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

    case RoleActionTypes.ROLE_SAVED:
      return adapter.updateOne(action.payload.role, state);

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
