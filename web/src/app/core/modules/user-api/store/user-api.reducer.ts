import { Action, on, createReducer } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { partialDataLoaded } from '@/core/store/normalization';

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
  on(
    userApiActions.userRequested,
    userApiActions.onlineUserListRequested,
    userApiActions.listPageRequested,
    userApiActions.changeOldPassword,
    userApiActions.updateUserRequested,
    (state) => ({ ...state, loading: true })
  ),
  on(userApiActions.userLoaded, (state, { user }) => usersAdapter.addOne(user, { ...state, loading: false })),
  on(userApiActions.listPageLoaded, (state, { response: { data } }) =>
    usersAdapter.upsertMany(data, {
      ...state,
      loading: false
    })
  ),
  on(userApiActions.onlineUserListLoaded, (state, { list }) =>
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  on(partialDataLoaded, (state, { Users }) => {
    if (Users) {
      return usersAdapter.upsertMany(Users, {
        ...state
      });
    }
  }),
  on(userApiActions.userApiError, userApiActions.changePasswordSuccess, (state) => ({
    ...state,
    loading: false
  }))
);

export const reducer = (state: UsersState | undefined, action: Action) => usersReducer(state, action);

export const usersFeatureKey = 'user-api';

export const { selectAll, selectEntities, selectIds, selectTotal } = usersAdapter.getSelectors();
