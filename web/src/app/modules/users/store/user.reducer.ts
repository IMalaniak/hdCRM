import { Action, on, createReducer } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { getInitialPaginationState, pagesAdapter, PaginationState, partialDataLoaded } from '@/shared/store';
import { User } from '../models';
import * as userActions from './user.actions';

export interface UsersEntityState extends EntityState<User> {}

export interface UsersState extends PaginationState<UsersEntityState> {}

const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  sortComparer: false
});

const initialUsersEntityState: UsersEntityState = usersAdapter.getInitialState();

export const initialUsersState: UsersState = getInitialPaginationState<UsersEntityState, UsersState>(
  initialUsersEntityState
);

const usersReducer = createReducer(
  initialUsersState,
  on(userActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(userActions.userLoaded, (state, { user }) => ({
    ...state,
    loading: false,
    data: usersAdapter.addOne(user, { ...state.data })
  })),
  on(userActions.listPageRequested, (state) => ({ ...state, pages: { ...state.pages, pageLoading: true } })),
  on(userActions.listPageLoaded, (state, { page, response: { data, pages, resultsNum } }) => ({
    ...state,
    data: usersAdapter.upsertMany(data, {
      ...state.data
    }),
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(userActions.OnlineUserListRequested, (state) => ({ ...state, loading: true })),
  on(userActions.OnlineUserListLoaded, (state, { list }) => ({
    ...state,
    loading: false,
    data: usersAdapter.upsertMany(list, {
      ...state.data
    })
  })),
  on(userActions.userOnline, (state, { user }) => ({
    ...state,
    data: usersAdapter.upsertOne(user, {
      ...state.data
    })
  })),
  on(userActions.userOffline, (state, { user }) => ({
    ...state,
    data: usersAdapter.upsertOne(user, {
      ...state.data
    })
  })),
  on(userActions.updateUserRequested, (state) => ({ ...state, loading: true })),
  on(userActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    editing: false,
    data: usersAdapter.updateOne(user, {
      ...state.data
    })
  })),
  on(userActions.deleteUser, (state, { id }) => ({
    ...state,
    loading: false,
    data: usersAdapter.removeOne(id, {
      ...state.data
    })
  })),
  on(userActions.usersInvited, (state, { invitedUsers }) => ({
    ...state,
    loading: false,
    data: usersAdapter.addMany(invitedUsers, {
      ...state.data
    })
  })),
  on(userActions.changeOldPassword, (state) => ({ ...state, loading: true })),
  on(userActions.changePasswordSuccess, (state) => ({ ...state, loading: false })),
  on(userActions.userApiError, (state) => ({ ...state, loading: false })),
  on(partialDataLoaded, (state, { Users }) => ({
    ...state,
    ...(Users && {
      data: usersAdapter.upsertMany(Users, {
        ...state.data
      })
    })
  }))
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}

export const usersFeatureKey = 'users';

export const { selectAll, selectEntities, selectIds, selectTotal } = usersAdapter.getSelectors();
