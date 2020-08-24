import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../models';
import * as UserActions from './user.actions';
import { Action, on, createReducer } from '@ngrx/store';

export interface UsersState extends EntityState<User> {
  allUsersLoaded: boolean;
  loading: boolean;
  editing: boolean;
  pages: number;
  countAll: number;
}

function sortByIdAndActiveState(u1: User, u2: User) {
  const compare = u1.id - u2.id;
  if (compare !== 0) {
    return compare;
  } else {
    return u1.StateId - u2.StateId;
  }
}

const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  sortComparer: sortByIdAndActiveState
});

const initialState: UsersState = adapter.getInitialState({
  allUsersLoaded: false,
  loading: false,
  editing: false,
  pages: null,
  countAll: null
});

const usersReducer = createReducer(
  initialState,
  on(UserActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(UserActions.userLoaded, (state, { user }) => adapter.addOne(user, state)),
  on(UserActions.listPageRequested, state => ({ ...state, loading: true })),
  on(UserActions.listPageLoaded, (state, { response: { data, pages, resultsNum } }) =>
    adapter.upsertMany(data, {
      ...state,
      loading: false,
      pages: pages,
      countAll: resultsNum
    })
  ),
  on(UserActions.OnlineUserListRequested, state => ({ ...state, loading: true })),
  on(UserActions.OnlineUserListLoaded, (state, { list }) =>
    adapter.upsertMany(list, {
      ...state,
      loading: false
    })
  ),
  on(UserActions.userOnline, (state, { user }) =>
    adapter.upsertOne(user, {
      ...state
    })
  ),
  on(UserActions.userOffline, (state, { user }) =>
    adapter.upsertOne(user, {
      ...state
    })
  ),
  on(UserActions.updateUserRequested, state => ({ ...state, loading: true })),
  on(UserActions.updateUserSuccess, (state, { user }) =>
    adapter.updateOne(user, { ...state, loading: false, editing: false })
  ),
  on(UserActions.deleteUser, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1
    })
  ),
  on(UserActions.usersInvited, (state, { invitedUsers }) =>
    adapter.addMany(invitedUsers, {
      ...state,
      countAll: state.countAll + invitedUsers.length
    })
  ),
  on(UserActions.changeOldPassword, state => ({ ...state, loading: true })),
  on(UserActions.changePasswordSuccess, state => ({ ...state, loading: false })),
  on(UserActions.userApiError, state => ({ ...state, loading: false }))
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}

export const usersFeatureKey = 'users';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
