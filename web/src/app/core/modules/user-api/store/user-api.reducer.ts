import { Action, on, createReducer } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { partialDataLoaded } from '@/shared/store';
import { User } from '../shared';
import * as userApiActions from './user-api.actions';

export interface UsersState extends EntityState<User> {
  loading: boolean;
}

const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  sortComparer: false
});

export const initialUsersState: UsersState = usersAdapter.getInitialState({
  loading: false
});

const usersReducer = createReducer(
  initialUsersState,
  on(userApiActions.userLoaded, (state, { user }) => usersAdapter.addOne(user, { ...state, loading: false })),
  on(userApiActions.listPageRequested, (state) => ({ ...state, loading: true })),
  on(userApiActions.listPageLoaded, (state, { response: { data } }) =>
    usersAdapter.upsertMany(data, {
      ...state,
      loading: false
    })
  ),
  on(userApiActions.OnlineUserListRequested, (state) => ({ ...state, loading: true })),
  on(userApiActions.OnlineUserListLoaded, (state, { list }) =>
    usersAdapter.upsertMany(list, {
      ...state,
      loading: false
    })
  ),
  on(userApiActions.userOnline, (state, { user }) =>
    usersAdapter.upsertOne(user, {
      ...state
    })
  ),
  on(userApiActions.userOffline, (state, { user }) =>
    usersAdapter.upsertOne(user, {
      ...state
    })
  ),
  on(userApiActions.updateUserRequested, (state) => ({ ...state, loading: true })),
  on(userApiActions.updateUserSuccess, (state, { user }) =>
    usersAdapter.updateOne(user, {
      ...state,
      loading: false
    })
  ),
  on(userApiActions.deleteUser, (state, { id }) =>
    usersAdapter.removeOne(id, {
      ...state,
      loading: false
    })
  ),
  on(userApiActions.usersInvited, (state, { invitedUsers }) =>
    usersAdapter.addMany(invitedUsers, {
      ...state,
      loading: false
    })
  ),
  on(userApiActions.userApiError, (state) => ({
    ...state,
    loading: false
  })),
  on(partialDataLoaded, (state, { Users }) => {
    if (Users) {
      return usersAdapter.upsertMany(Users, {
        ...state
      });
    }
  }),
  // TODO: move specific functionality to user management module
  on(userApiActions.changeOldPassword, (state) => ({ ...state, loading: true })),
  on(userApiActions.changePasswordSuccess, (state) => ({ ...state, loading: false }))
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}

export const usersFeatureKey = 'users';

export const { selectAll, selectEntities, selectIds, selectTotal } = usersAdapter.getSelectors();
