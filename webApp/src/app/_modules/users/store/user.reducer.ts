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

export function usersReducer(state = initialUsersState, action: UserActions): UsersState {
  switch (action.type) {
    case UserActionTypes.USER_LOADED:
      return adapter.addOne(action.payload.user, state);

    case UserActionTypes.USER_LIST_PAGE_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case UserActionTypes.USER_LIST_PAGE_LOADED:
      return adapter.upsertMany(action.payload.list, {
        ...state,
        loading: false,
        pages: action.payload.pages,
        countAll: action.payload.count
      });

    case UserActionTypes.USER_LIST_PAGE_CANCELLED:
      return {
        ...state,
        loading: false
      };

    case UserActionTypes.ONLINE_USER_LIST_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case UserActionTypes.USER_ONLINE:
      return adapter.upsertOne(action.payload, {
        ...state
      });

    case UserActionTypes.USER_OFFLINE:
      return adapter.upsertOne(action.payload, {
        ...state
      });

    case UserActionTypes.ONLINE_USER_LIST_LOADED:
      return adapter.upsertMany(action.payload, {
        ...state,
        loading: false
      });

    case UserActionTypes.USER_SAVED:
      return adapter.updateOne(action.payload.user, state);

    case UserActionTypes.DELETE_USER:
      return adapter.removeOne(action.payload.userId, {
        ...state,
        countAll: state.countAll - 1
      });

    default: {
      return state;
    }
  }
}

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
