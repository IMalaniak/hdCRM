import { createFeatureSelector, createSelector } from '@ngrx/store';

import { User } from '@/core/modules/user-api/shared';
import { selectAllUsers } from '@/core/modules/user-api/store';
import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { ListDisplayMode, Page } from '@/shared/store';
import { userManagementFeatureKey, UserListState } from './user.reducer';

export const selectUsersState = createFeatureSelector<UserListState>(userManagementFeatureKey);
export const selectUserPagesState = createSelector(selectUsersState, (usersState) => usersState?.pages);

export const selectUserPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectUserPagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectUserPageLoading = createSelector(selectUserPagesState, (pagesState) => pagesState?.pageLoading);

export const selectIsEditing = createSelector(selectUsersState, (usersState) => usersState?.isEditing);

export const selectUsersTotalCount = createSelector(selectUserPagesState, (usersState) => usersState?.resultsNum);

export const selectUsersPage = (pageQuery: PageQuery) =>
  createSelector(selectAllUsers, selectUserPageByKey(pageQuery), (allUsers: User[], page: Page) => {
    if (!page) {
      return [];
    } else {
      return page.dataIds.map((id) => allUsers.find((user) => user.id === id));
    }
  });

export const selectListDisplayModeIsPopup = createSelector(
  selectUsersState,
  (userState) => userState.listDisplayMode === ListDisplayMode.POPUP
);

export const selectPreselectedUsersIds = createSelector(selectUsersState, (userState) => userState.selectedUsersIds);
