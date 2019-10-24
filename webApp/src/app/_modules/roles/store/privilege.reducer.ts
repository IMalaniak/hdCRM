import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Privilege } from '../_models';
import { RoleActions, RoleActionTypes } from './role.actions';


export interface PrivilegesState extends EntityState<Privilege> {
  allPrivilegesLoaded: boolean;
  error: string;
  loading: boolean;
}

export const adapter: EntityAdapter<Privilege> = createEntityAdapter<Privilege>();


export const initialPrivilegesState: PrivilegesState = adapter.getInitialState({
  allPrivilegesLoaded: false,
  error: null,
  loading: false
});


export function privilegesReducer(state = initialPrivilegesState , action: RoleActions): PrivilegesState {

  switch (action.type) {

    case RoleActionTypes.PRIVILEGE_CREATE_SUCCESS:
      return adapter.addOne(action.payload.privilege, state);

    case RoleActionTypes.PRIVILEGE_CREATE_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case RoleActionTypes.ALLPRIVILEGES_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case RoleActionTypes.ALLPRIVILEGES_REQUEST_CANCELED:
      return {
        ...state,
        loading: false
      };

    case RoleActionTypes.ALLPRIVILEGES_LOADED:
      return adapter.addAll(action.payload.list, {...state, allPrivilegesLoaded: true, loading: false});

    case RoleActionTypes.PRIVILEGE_SAVED:
      return adapter.updateOne(action.payload.privilege, state);

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
