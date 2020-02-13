import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../_models';
import * as UserActions from './user.actions';
import { Action, on, createReducer } from '@ngrx/store';

export interface UsersState extends EntityState<User> {
  allUsersLoaded: boolean;
  error: string;
  loading: boolean;
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
  error: null,
  loading: false,
  pages: null,
  countAll: null
});

const usersReducer = createReducer(
  initialState,
  on(UserActions.userLoaded, (state, { user }) => adapter.addOne(user, state)),
  on(UserActions.listPageRequested, state => ({ ...state, loading: true })),
  on(UserActions.listPageLoaded, (state, { response }) =>
    adapter.upsertMany(response.list, {
      ...state,
      loading: false,
      pages: response.pages,
      countAll: response.count
    })
  ),
  on(UserActions.listPageCancelled, state => ({ ...state, loading: false })),
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
  on(UserActions.userSaved, (state, { user }) => adapter.updateOne(user, state)),
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
  )
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}

export const usersFeatureKey = 'users';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
