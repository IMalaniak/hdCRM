import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRole from './role.reducer';
import { PageQuery } from '@/core/_models';
import { Role } from '../_models';

export const selectRolesState = createFeatureSelector<fromRole.RolesState>('roles');

export const selectRoleById = (roleId: number) => createSelector(
    selectRolesState,
    rolesState => rolesState.entities[roleId]
);

export const selectAllRoles = createSelector(
  selectRolesState,
  fromRole.selectAll
);

export const selectRolesLoading = createSelector(
  selectRolesState,
  rolesState => rolesState.loading
);

export const selectRolesPagesCount = createSelector(
  selectRolesState,
  rolesState => rolesState.pages
);

export const selectRolesTotalCount = createSelector(
  selectRolesState,
  rolesState => rolesState.countAll
);

export const selectRolesPage = (page: PageQuery) => createSelector(
  selectAllRoles,
  selectRolesPagesCount,
  (allRoles: Role[], pagesCount: number) => {
    if (!pagesCount) {
      return [];
    } else {
      const start = page.pageIndex * page.pageSize,
            end = start + page.pageSize;
      return allRoles.slice(start, end);
    }
  }
);