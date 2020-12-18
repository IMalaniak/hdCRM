import { createFeatureSelector, createSelector } from '@ngrx/store';

import { currentUser } from '@/core/modules/auth/store/auth.selectors';
import { PageQuery } from '@/shared/models';
import { UserState } from '@/shared/constants';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as fromUser from './user-api.reducer';

export const selectUsersState = createFeatureSelector<fromUser.UsersState>(fromUser.usersFeatureKey);

export const selectUserById = (userId: number) =>
  createSelector(selectUsersState, (usersState) => usersState.entities[userId]);
export const selectUserPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectUsersState, (pagesState) => pagesState.entities[generatePageKey(pageQuery)]);

export const selectAllUserEntities = createSelector(selectUsersState, fromUser.selectEntities);
export const selectAllUsers = createSelector(selectUsersState, fromUser.selectAll);

export const selectUsersByState = (state: UserState) =>
  createSelector(selectAllUsers, (users) => users.filter((user) => user.state === state));

export const selectUsersOnline = createSelector(selectAllUsers, currentUser, (users, appUser) =>
  users.filter((user) => user.online && user.id !== appUser.id)
);

export const selectUserApiIsLoading = createSelector(selectUsersState, (usersState) => usersState.loading);
