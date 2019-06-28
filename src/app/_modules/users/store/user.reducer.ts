import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../_models';
import { UserActions, UserActionTypes } from './user.actions';


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

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  sortComparer: sortByIdAndActiveState
});

export const initialUsersState: UsersState = adapter.getInitialState({
  allUsersLoaded: false,
  error: null,
  loading: false,
  pages: null,
  countAll: null
});


export function usersReducer(state = initialUsersState , action: UserActions): UsersState {

  switch (action.type) {

    case UserActionTypes.UserLoaded:
      return adapter.addOne(action.payload.user, state);

    case UserActionTypes.UserListPageRequested:
      return {
        ...state,
        loading: true
      };

    case UserActionTypes.UserListPageLoaded:
      return adapter.addMany(action.payload.list, {...state, loading: false, pages: action.payload.pages, countAll: action.payload.count});

    case UserActionTypes.UserListPageCancelled:
      return {
        ...state,
        loading: false
      };

    case UserActionTypes.AllUsersLoaded:
      return adapter.addAll(action.payload.users, {...state, allUsersLoaded: true});

    case UserActionTypes.UserSaved:
      return adapter.updateOne(action.payload.user, state);

    default: {
      return state;
    }

  }
}


export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
