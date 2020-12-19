import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { denormalize } from 'normalizr';

import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { selectAllRoleEntities } from '@/core/modules/role-api/store/role';
import { Role } from '@/core/modules/role-api/shared';
import { roleListSchema } from '@/core/store/normalization';
import { PageQuery } from '@/shared/models';
import { ListState, Page } from '@/shared/store';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as fromRole from './role.reducer';

export const selectRolesState = createFeatureSelector<ListState>(fromRole.rolesFeatureKey);
export const selectRolePagesState = createSelector(selectRolesState, (rolesState) => rolesState?.pages);

export const selectRolePageByKey = (pageQuery: PageQuery) =>
  createSelector(selectRolePagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectRolesPageLoading = createSelector(selectRolePagesState, (pagesState) => pagesState?.pageLoading);

export const selectRolesTotalCount = createSelector(selectRolePagesState, (rolesState) => rolesState?.resultsNum);

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

export const selectIsEditing = createSelector(selectRolesState, (roleState) => roleState?.editing);
