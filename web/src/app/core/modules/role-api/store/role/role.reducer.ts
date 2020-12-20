import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { Role } from '../../shared/models';
import * as roleActions from './role.actions';

export interface RolesState extends EntityState<Role> {
  dashboardDataLoaded: boolean;
  loading: boolean;
}

const roleAdapter: EntityAdapter<Role> = createEntityAdapter<Role>({
  sortComparer: false
});

export const initialRolesState: RolesState = roleAdapter.getInitialState({
  dashboardDataLoaded: false,
  loading: false
});

const reducer = createReducer(
  initialRolesState,
  on(roleActions.createRoleRequested, roleActions.updateRoleRequested, roleActions.deleteRoleRequested, (state) => ({
    ...state,
    loading: true
  })),
  on(roleActions.listPageRequested, (state) => ({
    ...state
  })),
  on(roleActions.createRoleSuccess, (state, { role }) =>
    roleAdapter.addOne(role, {
      ...state,
      loading: false
    })
  ),
  on(roleActions.roleLoaded, (state, { role }) =>
    roleAdapter.addOne(role, {
      ...state,
      loading: false
    })
  ),
  on(roleActions.listPageLoaded, (state, { response: { data } }) =>
    roleAdapter.upsertMany(data, {
      ...state,
      loading: false
    })
  ),
  on(roleActions.deleteRoleSuccess, (state, { id }) =>
    roleAdapter.removeOne(id, {
      ...state,
      loading: false
    })
  ),
  on(roleActions.updateRoleSuccess, (state, { role }) =>
    roleAdapter.updateOne(role, {
      ...state,
      loading: false
    })
  ),
  on(roleActions.roleDashboardDataLoaded, (state, { response: { data } }) =>
    roleAdapter.upsertMany(data, {
      ...state,
      loading: false,
      dashboardDataLoaded: true
    })
  ),
  on(roleActions.rolesApiError, (state) => ({
    ...state,
    loading: false
  }))
);

export function rolesReducer(state: RolesState | undefined, action: Action) {
  return reducer(state, action);
}

export const rolesFeatureKey = 'role-api';

export const { selectAll, selectEntities, selectIds, selectTotal } = roleAdapter.getSelectors();
