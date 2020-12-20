import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Privilege } from '../../shared/models';
import * as PrivilegeActions from './privilege.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface PrivilegesState extends EntityState<Privilege> {
  allPrivilegesLoaded: boolean;
  loading: boolean;
}

const adapter: EntityAdapter<Privilege> = createEntityAdapter<Privilege>();

export const initialPrivilegesState: PrivilegesState = adapter.getInitialState({
  allPrivilegesLoaded: false,
  loading: false
});

const reducer = createReducer(
  initialPrivilegesState,
  on(PrivilegeActions.createPrivilegeSuccess, (state, { privilege }) => adapter.addOne(privilege, state)),
  on(PrivilegeActions.allPrivilegesRequested, (state) => ({ ...state, loading: true })),
  on(PrivilegeActions.allPrivilegesRequestCanceled, (state) => ({ ...state, loading: false })),
  on(PrivilegeActions.allPrivilegesApiLoaded, (state, { response }) =>
    adapter.setAll(response.data, {
      ...state,
      allPrivilegesLoaded: true,
      loading: false
    })
  ),
  on(PrivilegeActions.privilegeSaved, (state, { privilege }) => adapter.updateOne(privilege, state)),
  on(PrivilegeActions.privilegeApiError, (state) => ({ ...state }))
);

export function privilegesReducer(state: PrivilegesState | undefined, action: Action) {
  return reducer(state, action);
}

export const privilegesFeatureKey = 'privilege-api';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
