import { createAction, props } from '@ngrx/store';
import { User, UserServerResponse } from '../models';
import { Update } from '@ngrx/entity';
import { PageQuery, NewPassword, ApiResponse } from '@/shared';

export const changeIsEditingState = createAction(
  '[User Details] Change Is Editing State',
  props<{ isEditing: boolean }>()
);

export const userRequested = createAction('[User Details] User Requested', props<{ id: number }>());

export const userLoaded = createAction('[Users API] User Loaded', props<{ user: User }>());

export const updateUserRequested = createAction('[User Details] Update User Requested', props<{ user: User }>());
export const updateUserCancelled = createAction('[Users API] Update User Cancelled');
export const updateUserSuccess = createAction('[User API] Update User Success', props<{ user: Update<User> }>());

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

export const changeOldPassword = createAction(
  '[User Details] Set New Password Requested',
  props<{ newPassword: NewPassword }>()
);

export const changePasswordSuccess = createAction(
  '[User API] Change Password Success',
  props<{ response: ApiResponse }>()
);

export const changePasswordFailure = createAction(
  '[User API] Change Password Failure',
  props<{ response: ApiResponse }>()
);
