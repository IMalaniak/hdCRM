import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PageQuery } from '@/shared/models';
import { Page, roleListSchema, roleSchema } from '@/shared/store';
import * as fromRole from './role.reducer';
import { Role } from '../models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { selectAllUserEntities } from '@/modules/users/store/user.selectors';
import { denormalize } from 'normalizr';
import { Dictionary } from '@ngrx/entity';

export const selectRolesState = createFeatureSelector<fromRole.RolesState>(fromRole.rolesFeatureKey);
export const selectRoleEntityState = createSelector(selectRolesState, (rolesState) => rolesState.data);
export const selectRolePagesState = createSelector(selectRolesState, (rolesState) => rolesState.pages);

export const selectRoleById = (roleId: number) =>
  createSelector(selectRoleEntityState, (rolesState) => rolesState.entities[roleId]);
export const selectRoleDeepById = (roleId: number) =>
  createSelector(selectRoleById(roleId), selectAllUserEntities, (role, userEntities) => {
    return denormalize(role, roleSchema, { Users: userEntities });
  });
export const selectRolePageByKey = (pageQuery: PageQuery) =>
  createSelector(selectRolePagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectAllRoleIds = createSelector(selectRoleEntityState, fromRole.selectIds);
export const selectAllRoleEntities = createSelector(selectRoleEntityState, fromRole.selectEntities);
export const selectAllRoles = createSelector(selectRoleEntityState, fromRole.selectAll);

export const selectRolesLoading = createSelector(selectRolesState, (rolesState) => rolesState.loading);
export const selectRolesPageLoading = createSelector(selectRolePagesState, (pagesState) => pagesState?.pageLoading);

export const selectRolesPagesCount = createSelector(selectRolesState, (rolesState) => rolesState.pages);

export const selectRolesTotalCount = createSelector(selectRolePagesState, (rolesState) => rolesState.resultsNum);

export const selectRolesOfPage = (pageQuery: PageQuery) =>
  createSelector(
    selectAllRoleEntities,
    selectRolePageByKey(pageQuery),
    selectAllUserEntities,
    (roleEntities: Dictionary<Role>, page: Page, userEntities) => {
      return page
        ? (denormalize(page.dataIds, roleListSchema, { Users: userEntities, Roles: roleEntities }) as Role[])
        : [];
    }
  );

export const selectRolesDashboardDataLoaded = createSelector(
  selectRolesState,
  (roleState) => roleState.dashboardDataLoaded
);

export const selectIsEditing = createSelector(selectRolesState, (roleState) => roleState.editing);
