import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { getInitialPaginationState, pagesAdapter, PaginationState } from '@/shared/store';
import { Role } from '../models';
import * as roleActions from './role.actions';

export interface RolesEntityState extends EntityState<Role> {}

export interface RolesState extends PaginationState<RolesEntityState> {
  dashboardDataLoaded: boolean;
}

const roleAdapter: EntityAdapter<Role> = createEntityAdapter<Role>({
  sortComparer: false
});

const initialRolesEntityState: RolesEntityState = roleAdapter.getInitialState({
  dashboardDataLoaded: false
});

export const initialRolesState: RolesState = getInitialPaginationState<RolesEntityState, RolesState>(
  initialRolesEntityState
);

const rolesReducer = createReducer(
  initialRolesState,
  on(roleActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(roleActions.createRoleRequested, roleActions.updateRoleRequested, roleActions.deleteRoleRequested, (state) => ({
    ...state,
    loading: true
  })),
  on(roleActions.listPageRequested, (state) => ({
    ...state,
    pages: {
      ...state.pages,
      pageLoading: true
    }
  })),
  on(roleActions.createRoleSuccess, (state, { role }) => ({
    ...state,
    loading: false,
    data: roleAdapter.addOne(role, {
      ...state.data
    }),
    pages: initialRolesState.pages
  })),
  on(roleActions.roleLoaded, (state, { role }) => ({
    ...state,
    loading: false,
    data: roleAdapter.addOne(role, { ...state.data })
  })),
  on(roleActions.listPageLoaded, (state, { page, response: { data, pages, resultsNum } }) => ({
    ...state,
    data: roleAdapter.upsertMany(data, {
      ...state.data
    }),
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(roleActions.deleteRoleSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    data: roleAdapter.removeOne(id, {
      ...state.data
    }),
    pages: initialRolesState.pages
  })),
  on(roleActions.updateRoleSuccess, (state, { role }) => ({
    ...state,
    loading: false,
    editing: false,
    data: roleAdapter.updateOne(role, { ...state.data })
  })),
  on(roleActions.roleDashboardDataLoaded, (state, { response: { data } }) => ({
    ...state,
    loading: false,
    data: roleAdapter.upsertMany(data, {
      ...state.data,
      dashboardDataLoaded: true
    })
  })),
  on(roleActions.rolesApiError, (state) => ({
    ...state,
    loading: false,
    pages: { ...state.pages, pageLoading: false }
  }))
);

export function reducer(state: RolesState | undefined, action: Action) {
  return rolesReducer(state, action);
}

export const rolesFeatureKey = 'roles';

export const { selectAll, selectEntities, selectIds, selectTotal } = roleAdapter.getSelectors();
