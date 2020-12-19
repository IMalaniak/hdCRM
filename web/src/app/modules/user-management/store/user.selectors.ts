import { createFeatureSelector, createSelector } from '@ngrx/store';

import { User } from '@/core/modules/user-api/shared';
import { selectAllUsers } from '@/core/modules/user-api/store';
import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { ListState, Page } from '@/shared/store';
import * as fromUser from './user.reducer';

export const selectUsersState = createFeatureSelector<ListState>(fromUser.userManagementFeatureKey);
export const selectUserPagesState = createSelector(selectUsersState, (usersState) => usersState?.pages);

export const selectUserPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectUserPagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectUserPageLoading = createSelector(selectUserPagesState, (pagesState) => pagesState?.pageLoading);

export const selectIsEditing = createSelector(selectUsersState, (usersState) => usersState?.editing);

export const selectUsersTotalCount = createSelector(selectUserPagesState, (usersState) => usersState?.resultsNum);

export const selectUsersPage = (pageQuery: PageQuery) =>
  createSelector(selectAllUsers, selectUserPageByKey(pageQuery), (allUsers: User[], page: Page) => {
    if (!page) {
      return [];
    } else {
      return page.dataIds.map((id) => allUsers.find((user) => user.id === id));
    }
  });
