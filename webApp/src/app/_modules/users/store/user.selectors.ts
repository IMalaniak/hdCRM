import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';
import * as fromState from './state.reducer';
import { PageQuery } from '@/core/_models';
import { User } from '../_models';

export const selectUsersState = createFeatureSelector<fromUser.UsersState>('users');

export const selectStatesState = createFeatureSelector<fromState.StatesState>('states');

export const selectUserById = (userId: number) =>
  createSelector(selectUsersState, usersState => usersState.entities[userId]);

export const selectAllUsers = createSelector(selectUsersState, fromUser.selectAll);

export const selectUsersByState = (stateId: number) =>
  createSelector(selectAllUsers, users => users.filter(user => user.StateId === stateId));

export const allUsersLoaded = createSelector(selectUsersState, userState => userState.allUsersLoaded);

export const selectUsersLoading = createSelector(selectUsersState, usersState => usersState.loading);

export const selectUsersPagesCount = createSelector(selectUsersState, usersState => usersState.pages);

export const selectUsersTotalCount = createSelector(selectUsersState, usersState => usersState.countAll);

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

export const selectAllStates = createSelector(selectStatesState, fromState.selectAll);

export const allStatesLoaded = createSelector(selectStatesState, stateState => stateState.allStatesLoaded);
