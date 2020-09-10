import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Role } from '../models';
import * as roleActions from './role.actions';

export interface RolesState extends EntityState<Role> {
  loading: boolean;
  pages: number;
  countAll: number;
  editing: boolean;
  dashboardDataLoaded: boolean;
}

const adapter: EntityAdapter<Role> = createEntityAdapter<Role>({});

const initialState: RolesState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  editing: false,
  dashboardDataLoaded: false
});

const rolesReducer = createReducer(
  initialState,
  on(roleActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(
    roleActions.listPageRequested,
    roleActions.createRoleRequested,
    roleActions.updateRoleRequested,
    roleActions.deleteRoleRequested,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(roleActions.createRoleSuccess, (state, { role }) =>
    adapter.addOne(role, {
      ...state,
      countAll: state.countAll + 1,
      loading: false
    })
  ),
  on(roleActions.roleLoaded, (state, { role }) => adapter.addOne(role, state)),
  on(roleActions.listPageLoaded, (state, { response: { data, pages, resultsNum } }) =>
    adapter.upsertMany(data, {
      ...state,
      loading: false,
      pages: pages,
      countAll: resultsNum
    })
  ),
  on(roleActions.deleteRoleSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1,
      loading: false
    })
  ),
  on(roleActions.updateRoleSuccess, (state, { role }) =>
    adapter.updateOne(role, { ...state, loading: false, editing: false })
  ),
  on(roleActions.roleDashboardDataLoaded, (state, { response: { data, resultsNum } }) =>
    adapter.upsertMany(data, {
      ...state,
      countAll: resultsNum,
      dashboardDataLoaded: true
    })
  ),
  on(roleActions.rolesApiError, (state) => ({ ...state, loading: false }))
);

export function reducer(state: RolesState | undefined, action: Action) {
  return rolesReducer(state, action);
}

export const rolesFeatureKey = 'roles';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
