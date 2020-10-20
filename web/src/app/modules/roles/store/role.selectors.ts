import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PageQuery } from '@/shared/models';
import { Page } from '@/shared/store';
import * as fromRole from './role.reducer';
import { Role } from '../models';
import { generatePageKey } from '@/shared/utils/generatePageKey';

export const selectRolesState = createFeatureSelector<fromRole.RolesState>(fromRole.rolesFeatureKey);
export const selectRoleEntityState = createSelector(selectRolesState, (rolesState) => rolesState.data);
export const selectRolePagesState = createSelector(selectRolesState, (rolesState) => rolesState.pages);

export const selectRoleById = (roleId: number) =>
  createSelector(selectRoleEntityState, (rolesState) => rolesState.entities[roleId]);
export const selectRolePageByKey = (pageQuery: PageQuery) =>
  createSelector(selectRolePagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectAllRoles = createSelector(selectRoleEntityState, fromRole.selectAll);

export const selectRolesLoading = createSelector(selectRolesState, (rolesState) => rolesState.loading);

export const selectRolesPagesCount = createSelector(selectRolesState, (rolesState) => rolesState.pages);

export const selectRolesTotalCount = createSelector(selectRolePagesState, (rolesState) => rolesState.resultsNum);

export const selectRolesOfPage = (pageQuery: PageQuery) =>
  createSelector(selectAllRoles, selectRolePageByKey(pageQuery), (allRoles: Role[], page: Page) => {
    return page ? page.dataIds.map((id) => allRoles.find((role) => role.id === id)) : [];
  });

export const selectRolesDashboardDataLoaded = createSelector(
  selectRolesState,
  (roleState) => roleState.dashboardDataLoaded
);

export const selectIsEditing = createSelector(selectRolesState, (roleState) => roleState.editing);
