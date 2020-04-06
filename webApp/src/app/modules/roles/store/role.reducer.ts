import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Role } from '../models';
import * as RoleActions from './role.actions';

export interface RolesState extends EntityState<Role> {
  loading: boolean;
  pages: number;
  countAll: number;
  dashboardDataLoaded: boolean;
  error: string;
}

const adapter: EntityAdapter<Role> = createEntityAdapter<Role>({});

const initialState: RolesState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  dashboardDataLoaded: false,
  error: null
});

const rolesReducer = createReducer(
  initialState,
  on(RoleActions.createRoleSuccess, (state, { role }) =>
    adapter.addOne(role, {
      ...state,
      countAll: state.countAll + 1
    })
  ),
  on(RoleActions.createRoleFail, (state, { error }) => ({ ...state, error })),
  on(RoleActions.roleLoaded, (state, { role }) => adapter.addOne(role, state)),
  on(RoleActions.listPageRequested, state => ({ ...state, loading: true })),
  on(RoleActions.listPageLoaded, (state, { response }) =>
    adapter.upsertMany(response.list, {
      ...state,
      loading: false,
      pages: response.pages,
      countAll: response.count
    })
  ),
  on(RoleActions.listPageCancelled, state => ({ ...state, loading: false })),
  on(RoleActions.deleteRole, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1
    })
  ),
  on(RoleActions.roleSaved, (state, { role }) => adapter.updateOne(role, state)),
  on(RoleActions.roleDashboardDataLoaded, (state, { response }) =>
    adapter.upsertMany(response.list, {
      ...state,
      countAll: response.count,
      dashboardDataLoaded: true
    })
  )
);

export function reducer(state: RolesState | undefined, action: Action) {
  return rolesReducer(state, action);
}

export const rolesFeatureKey = 'roles';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
