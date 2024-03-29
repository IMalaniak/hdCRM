import { Action, on, createReducer } from '@ngrx/store';

import { User } from '@core/modules/user-api/shared';
import * as userApiActions from '@core/modules/user-api/store/user-api.actions';
import { initialListState, pagesAdapter, ListState, LIST_DISPLAY_MODE } from '@shared/store';

import * as userActions from './user.actions';

export interface UserListState extends ListState<User> {
  selectedUsersIds: number[] | null;
}

const reducer = createReducer(
  initialListState,
  on(userActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    isEditing
  })),
  on(userActions.prepareSelectionPopup, (state, { selectedUsersIds, singleSelection }) => ({
    ...state,
    listDisplayMode: singleSelection
      ? LIST_DISPLAY_MODE.POPUP_SINGLE_SELECTION
      : LIST_DISPLAY_MODE.POPUP_MULTI_SELECTION,
    selectedUsersIds
  })),
  on(userActions.resetSelectionPopup, (state) => ({
    ...state,
    listDisplayMode: LIST_DISPLAY_MODE.DEFAULT,
    selectedUsersIds: null
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

export const usersReducer = (state: UserListState | undefined, action: Action) => reducer(state, action);

export const userManagementFeatureKey = 'user-management';
