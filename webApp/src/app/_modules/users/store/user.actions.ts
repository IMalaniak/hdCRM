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
  USER_LIST_PAGE_LOADED = '[Users API] User Page Loaded',
  USER_LIST_PAGE_CANCELLED = '[Users API] User Page Cancelled',
  ONLINE_USER_LIST_REQUESTED = '[Users] Online Users Requested',
  ONLINE_USER_LIST_LOADED = '[Users API] Online User List Loaded',
  USER_ONLINE = '[User Socket API] User Online',
  USER_OFFLINE = '[User Socket API] User Offline',
  INVITE_USERS = '[Invitation Dialog] Invite users requested',
  USERS_INVITED = '[Users API] Invite users requested'
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

export class OnlineUserListRequested implements Action {
  readonly type = UserActionTypes.ONLINE_USER_LIST_REQUESTED;
}

export class OnlineUserListLoaded implements Action {
  readonly type = UserActionTypes.ONLINE_USER_LIST_LOADED;
  constructor(public payload: User[]) {}
}

export class UserOnline implements Action {
  readonly type = UserActionTypes.USER_ONLINE;
  constructor(public payload: User) {}
}

export class UserOffline implements Action {
  readonly type = UserActionTypes.USER_OFFLINE;
  constructor(public payload: User) {}
}

export class InviteUsers implements Action {
  readonly type = UserActionTypes.INVITE_USERS;
  constructor(public payload: User[]) {}
}

export class UsersInvited implements Action {
  readonly type = UserActionTypes.USERS_INVITED;
  constructor(public payload: User[]) {}
}


export type UserActions =
  | UserRequested
  | UserLoaded
  | UserSaved
  | UserListPageRequested
  | UserListPageLoaded
  | UserListPageCancelled
  | DeleteUser
  | OnlineUserListRequested
  | OnlineUserListLoaded
  | UserOnline
  | UserOffline
  | InviteUsers
  | UsersInvited;
