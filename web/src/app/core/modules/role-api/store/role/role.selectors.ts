import { createFeatureSelector, createSelector } from '@ngrx/store';
import { denormalize } from 'normalizr';

import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { roleSchema } from '@/core/store/normalization';
import * as fromRole from './role.reducer';

export const selectRolesState = createFeatureSelector<fromRole.RolesState>(fromRole.rolesFeatureKey);

export const selectRoleById = (roleId: number) =>
  createSelector(selectRolesState, (rolesState) => rolesState.entities[roleId]);
export const selectRoleDeepById = (roleId: number) =>
  createSelector(selectRoleById(roleId), selectAllUserEntities, (role, userEntities) => {
    return denormalize(role, roleSchema, { Users: userEntities });
  });

export const selectAllRoleIds = createSelector(selectRolesState, fromRole.selectIds);
export const selectAllRoleEntities = createSelector(selectRolesState, fromRole.selectEntities);
export const selectAllRoles = createSelector(selectRolesState, fromRole.selectAll);

export const selectRolesLoading = createSelector(selectRolesState, (rolesState) => rolesState.loading);

export const selectRolesDashboardDataLoaded = createSelector(
  selectRolesState,
  (roleState) => roleState.dashboardDataLoaded
);
