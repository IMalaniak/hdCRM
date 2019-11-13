import { Action } from '@ngrx/store';
import { User, UserServerResponse, State } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export enum UserActionTypes {
  USER_REQUESTED = '[User Details] User Requested',
  USER_LOADED = '[Users API] User Loaded',
  USER_SAVED = '[User Details] User Changes Saved',
  DELETE_USER = '[User List] Delete User',
  USER_LIST_PAGE_REQUESTED = '[User List] User Page Requested',
  USER_LIST_PAGE_LOADED = '[User API] User Page Loaded',
  USER_LIST_PAGE_CANCELLED = '[User API] User Page Cancelled',
  ALLSTATES_REQUESTED = '[User Details] User States list requested',
  ALLSTATES_LOADED = '[User Details] User States list loaded'
}

export class UserRequested implements Action {
  readonly type = UserActionTypes.USER_REQUESTED;
  constructor(public payload: { userId: number }) {}
}

export class UserLoaded implements Action {
  readonly type = UserActionTypes.USER_LOADED;
  constructor(public payload: { user: User }) {}
}

export class UserSaved implements Action {
  readonly type = UserActionTypes.USER_SAVED;
  constructor(public payload: { user: Update<User> }) {}
}

export class DeleteUser implements Action {
  readonly type = UserActionTypes.DELETE_USER;
  constructor(public payload: { userId: number }) {}
}

export class UserListPageRequested implements Action {
  readonly type = UserActionTypes.USER_LIST_PAGE_REQUESTED;
  constructor(public payload: { page: PageQuery }) {}
}

export class UserListPageLoaded implements Action {
  readonly type = UserActionTypes.USER_LIST_PAGE_LOADED;
  constructor(public payload: UserServerResponse) {}
}

export class UserListPageCancelled implements Action {
  readonly type = UserActionTypes.USER_LIST_PAGE_CANCELLED;
}

export class AllStatesRequested implements Action {
  readonly type = UserActionTypes.ALLSTATES_REQUESTED;
}

export class AllStatesLoaded implements Action {
  readonly type = UserActionTypes.ALLSTATES_LOADED;
  constructor(public payload: { states: State[] }) {}
}

export type UserActions =
  | UserRequested
  | UserLoaded
  | UserSaved
  | UserListPageRequested
  | UserListPageLoaded
  | UserListPageCancelled
  | DeleteUser
  | AllStatesRequested
  | AllStatesLoaded;
