import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';
import { PageQuery } from '@/shared/models';
import { User } from '../models';
import { UserState } from '@/shared/constants';
import { currentUser } from '@/core/auth/store/auth.selectors';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { Page } from '@/shared/store';

export const selectUsersState = createFeatureSelector<fromUser.UsersState>(fromUser.usersFeatureKey);
export const selectUserEntityState = createSelector(selectUsersState, (usersState) => usersState.data);
export const selectUserPagesState = createSelector(selectUsersState, (usersState) => usersState.pages);

export const selectUserById = (userId: number) =>
  createSelector(selectUserEntityState, (usersState) => usersState.entities[userId]);
export const selectUserPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectUserPagesState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectAllUsers = createSelector(selectUserEntityState, fromUser.selectAll);

export const selectUsersByState = (state: UserState) =>
  createSelector(selectAllUsers, (users) => users.filter((user) => user.state === state));

export const selectUsersOnline = createSelector(selectAllUsers, currentUser, (users, appUser) =>
  users.filter((user) => user.online && user.id !== appUser.id)
);

export const selectIsLoading = createSelector(selectUsersState, (usersState) => usersState.loading);
export const selectUserPageLoading = createSelector(selectUserPagesState, (pagesState) => pagesState?.pageLoading);

export const selectIsEditing = createSelector(selectUsersState, (usersState) => usersState.editing);

export const selectUsersPagesCount = createSelector(selectUsersState, (usersState) => usersState.pages);

export const selectUsersTotalCount = createSelector(selectUserPagesState, (usersState) => usersState.resultsNum);

export const selectUsersPage = (pageQuery: PageQuery) =>
  createSelector(selectAllUsers, selectUserPageByKey(pageQuery), (allUsers: User[], page: Page) => {
    if (!page) {
      return [];
    } else {
      return page.dataIds.map((id) => allUsers.find((user) => user.id === id));
    }
  });
