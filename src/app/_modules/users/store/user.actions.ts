import { Action } from '@ngrx/store';
import { User, UserServerResponse, State } from '../_models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/core/_models';

export enum UserActionTypes {
  UserRequested = '[User Details] User Requested',
  UserLoaded = '[Users API] User Loaded',
  UserSaved = '[User Details] User Changes Saved',
  UserListPageRequested = '[User List] User Page Requested',
  UserListPageLoaded = '[User API] User Page Loaded',
  UserListPageCancelled = '[User API] User Page Cancelled',
  AllUsersRequested = '[Users List] All Users Requested',
  AllUsersLoaded = '[Users API] All Users Loaded',
  AllStatesRequested = '[User Details] User States list requested',
  AllStatesLoaded = '[User Details] User States list loaded'
}

export class UserRequested implements Action {
  readonly type = UserActionTypes.UserRequested;
  constructor(public payload: {userId: number}) {}
}

export class UserLoaded implements Action {
  readonly type = UserActionTypes.UserLoaded;
  constructor(public payload: {user: User}) {}
}

export class UserSaved implements Action {
  readonly type = UserActionTypes.UserSaved;
  constructor(public payload: {user: Update<User>}) {}
}

export class UserListPageRequested implements Action {
  readonly type = UserActionTypes.UserListPageRequested;
  constructor(public payload: {page: PageQuery}) {}
}

export class UserListPageLoaded implements Action {
  readonly type = UserActionTypes.UserListPageLoaded;
  constructor(public payload: UserServerResponse) {}
}

export class UserListPageCancelled implements Action {
  readonly type = UserActionTypes.UserListPageCancelled;
}

export class AllUsersRequested implements Action {
  readonly type = UserActionTypes.AllUsersRequested;
}

export class AllUsersLoaded implements Action {
  readonly type = UserActionTypes.AllUsersLoaded;
  constructor(public payload: {users: User[]}) {}
}

export class AllStatesRequested implements Action {
  readonly type = UserActionTypes.AllStatesRequested;
}

export class AllStatesLoaded implements Action {
  readonly type = UserActionTypes.AllStatesLoaded;
  constructor(public payload: {states: State[]}) {}
}

export type UserActions = UserRequested
  | UserLoaded
  | UserSaved
  | UserListPageRequested
  | UserListPageLoaded
  | UserListPageCancelled
  | AllUsersRequested
  | AllUsersLoaded
  | AllStatesRequested
  | AllStatesLoaded;
