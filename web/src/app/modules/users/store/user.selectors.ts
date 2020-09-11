import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';
import { PageQuery } from '@/shared/models';
import { User } from '../models';

export const selectUsersState = createFeatureSelector<fromUser.UsersState>(fromUser.usersFeatureKey);

export const selectUserById = (userId: number) =>
  createSelector(selectUsersState, (usersState) => usersState.entities[userId]);

export const selectAllUsers = createSelector(selectUsersState, fromUser.selectAll);

export const selectUsersByState = (stateId: number) =>
  createSelector(selectAllUsers, (users) => users.filter((user) => user.StateId === stateId));

export const selectUsersOnline = createSelector(selectAllUsers, (users) => users.filter((user) => user.online));

export const allUsersLoaded = createSelector(selectUsersState, (userState) => userState.allUsersLoaded);

export const selectIsLoading = createSelector(selectUsersState, (usersState) => usersState.loading);

export const selectIsEditing = createSelector(selectUsersState, (usersState) => usersState.editing);

export const selectUsersPagesCount = createSelector(selectUsersState, (usersState) => usersState.pages);

export const selectUsersTotalCount = createSelector(selectUsersState, (usersState) => usersState.countAll);

export const selectUsersPage = (page: PageQuery) =>
  createSelector(selectAllUsers, selectUsersPagesCount, (allUsers: User[], pagesCount: number) => {
    if (!pagesCount) {
      return [];
    } else {
      const start = page.pageIndex * page.pageSize,
        end = start + page.pageSize;
      return allUsers.slice(start, end);
    }
  });
