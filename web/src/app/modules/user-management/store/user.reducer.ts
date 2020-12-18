import { Action, on, createReducer } from '@ngrx/store';

import * as userApiActions from '@/core/modules/user-api/store/user-api.actions';
import { initialPagesState, pagesAdapter, PagesState } from '@/shared/store';
import * as userActions from './user.actions';

export interface UsersState {
  editing: boolean;
  pages: PagesState;
}

const initialUsersState: UsersState = {
  editing: false,
  pages: initialPagesState
};

const reducer = createReducer(
  initialUsersState,
  on(userActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
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
    editing: false
  })),
  on(userApiActions.deleteUser, (state) => ({
    ...state,
    pages: initialUsersState.pages
  })),
  on(userApiActions.usersInvited, (state) => ({
    ...state,
    pages: initialUsersState.pages
  })),
  on(userApiActions.userApiError, (state) => ({
    ...state,
    pages: { ...state.pages, pageLoading: false }
  }))
);

export function usersReducer(state: UsersState | undefined, action: Action) {
  return reducer(state, action);
}

export const userManagementFeatureKey = 'user-management';
