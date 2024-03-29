import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { PageQuery, NewPassword, CollectionApiResponse } from '@shared/models';
import { Page } from '@shared/store';

import { User } from '../shared';

const detailsPrefix = '[User Details]';
const listPrefix = '[Users List]';
const apiPrefix = '[Users API]';

export const userRequested = createAction(`${detailsPrefix} User Requested`, props<{ id: number }>());
export const userLoaded = createAction(`${apiPrefix} User Loaded`, props<{ user: User }>());

export const updateUserRequested = createAction(`${detailsPrefix} Update User Requested`, props<{ user: User }>());
export const updateUserSuccess = createAction(`${apiPrefix} Update User Success`, props<{ user: Update<User> }>());

export const deleteUser = createAction(`${listPrefix} Delete User`, props<{ id: number }>());

export const listPageRequested = createAction(`${listPrefix} User Page Requested`, props<{ page: PageQuery }>());
export const listPageLoaded = createAction(
  `${apiPrefix} User Page Loaded`,
  props<{ response: CollectionApiResponse<User>; page: Page }>()
);

export const onlineUserListRequested = createAction('[Users] Online Users Requested');
export const onlineUserListLoaded = createAction(`${apiPrefix} Online User List Loaded`, props<{ list: User[] }>());

export const userOnline = createAction('[User Socket API] User Online', props<{ user: User }>());
export const userOffline = createAction('[User Socket API] User Offline', props<{ user: User }>());

export const inviteUsers = createAction('[Invitation Dialog] Invite users requested', props<{ users: User[] }>());
export const usersInvited = createAction(`${apiPrefix} Invite users requested`, props<{ invitedUsers: User[] }>());

export const changeOldPassword = createAction(
  `${detailsPrefix} Set New Password Requested`,
  props<{ newPassword: NewPassword }>()
);

export const changePasswordSuccess = createAction(`${apiPrefix} Change Password Success`);

export const userApiError = createAction(`${apiPrefix} Failed Executing Request`);
