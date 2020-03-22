import { createAction, props } from '@ngrx/store';
import { User, UserServerResponse } from '../models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/shared';

export const userRequested = createAction('[User Details] User Requested', props<{ id: number }>());

export const userLoaded = createAction('[Users API] User Loaded', props<{ user: User }>());

export const userSaved = createAction('[User Details] User Changes Saved', props<{ user: Update<User> }>());

export const deleteUser = createAction('[User List] Delete User', props<{ id: number }>());

export const listPageRequested = createAction('[User List] User Page Requested', props<{ page: PageQuery }>());

export const listPageLoaded = createAction('[Users API] User Page Loaded', props<{ response: UserServerResponse }>());

export const listPageCancelled = createAction('[Users API] User Page Cancelled');

export const OnlineUserListRequested = createAction('[Users] Online Users Requested');

export const OnlineUserListLoaded = createAction('[Users API] Online User List Loaded', props<{ list: User[] }>());

export const userOnline = createAction('[User Socket API] User Online', props<{ user: User }>());

export const userOffline = createAction('[User Socket API] User Offline', props<{ user: User }>());

export const inviteUsers = createAction('[Invitation Dialog] Invite users requested', props<{ users: User[] }>());

export const usersInvited = createAction('[Users API] Invite users requested', props<{ invitedUsers: User[] }>());
