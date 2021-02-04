import { Action, on, createReducer } from '@ngrx/store';

import * as userApiActions from '@/core/modules/user-api/store/user-api.actions';
import { User } from '@/core/modules/user-api/shared';
import { initialListState, pagesAdapter, ListState } from '@/shared/store';
import * as userActions from './user.actions';

const reducer = createReducer(
  initialListState,
  on(userActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    isEditing
  })),
  on(userApiActions.listPageRequested, (state) => ({ ...state, pages: { ...state.pages, pageLoading: true } })),
  on(userApiActions.listPageLoaded, (state, { page, response: { pages, resultsNum } }) => ({
    ...state,
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(userApiActions.updateUserSuccess, (state) => ({
    ...state,
    isEditing: false
  })),
  on(userApiActions.deleteUser, (state) => ({
    ...state,
    pages: initialListState.pages
  })),
  on(userApiActions.usersInvited, (state) => ({
    ...state,
    pages: initialListState.pages
  })),
  on(userApiActions.userApiError, (state) => ({
    ...state,
    pages: { ...state.pages, pageLoading: false }
  }))
);

export function usersReducer(state: ListState<User> | undefined, action: Action) {
  return reducer(state, action);
}

export const userManagementFeatureKey = 'user-management';
