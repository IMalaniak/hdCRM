import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Role } from '../models';
import * as RoleActions from './role.actions';

export interface RolesState extends EntityState<Role> {
  loading: boolean;
  pages: number;
  countAll: number;
  dashboardDataLoaded: boolean;
}

const adapter: EntityAdapter<Role> = createEntityAdapter<Role>({});

const initialState: RolesState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  dashboardDataLoaded: false
});

const rolesReducer = createReducer(
  initialState,
  on(RoleActions.createRoleSuccess, (state, { role }) =>
    adapter.addOne(role, {
      ...state,
      countAll: state.countAll + 1
    })
  ),
  on(RoleActions.roleLoaded, (state, { role }) => adapter.addOne(role, state)),
  on(RoleActions.listPageRequested, state => ({ ...state, loading: true })),
  on(RoleActions.listPageLoaded, (state, { response: { data, pages, resultsNum } }) =>
    adapter.upsertMany(data, {
      ...state,
      loading: false,
      pages: pages,
      countAll: resultsNum
    })
  ),
  on(RoleActions.deleteRole, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1
    })
  ),
  on(RoleActions.roleSaved, (state, { role }) => adapter.updateOne(role, state)),
  on(RoleActions.roleDashboardDataLoaded, (state, { response: { data, resultsNum } }) =>
    adapter.upsertMany(data, {
      ...state,
      countAll: resultsNum,
      dashboardDataLoaded: true
    })
  ),
  on(RoleActions.rolesApiError, state => ({ ...state, loading: false }))
);

export function reducer(state: RolesState | undefined, action: Action) {
  return rolesReducer(state, action);
}

export const rolesFeatureKey = 'roles';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
