import { props, createAction } from '@ngrx/store';

import { Organization, User } from '@/core/modules/user-api/shared';
import { NewPassword } from '@/shared/models';

export const registerUser = createAction('[Auth] Register User Requested', props<{ user: User }>());
export const registerSuccess = createAction('[Auth API] Register Success');

export const logIn = createAction('[Auth] Login', props<{ user: User }>());
export const logInSuccess = createAction('[Auth API] Login Success', props<{ accessToken: string }>());

export const refreshSession = createAction('[Auth] Refresh Session Token');
export const refreshSessionSuccess = createAction(
  '[Auth API] Refresh Session Success',
  props<{ accessToken: string }>()
);
export const refreshSessionFailure = createAction('[Auth API] Refresh Session Failure');

export const setSessionId = createAction('[Auth Effect] Set Session Id', props<{ sessionId: number }>());
export const deleteSession = createAction('[Session Tab] Delete User Session', props<{ id: number }>());
export const deleteMultipleSession = createAction(
  '[Session Tab] Delete User Multiple Sessions',
  props<{ sessionIds: number[] }>()
);
export const deleteSessionSuccess = createAction('[Users API] Delete User Session Success');

export const checkIsTokenValid = createAction('[Auth] Check Token Validity');
export const checkIsTokenValidSuccess = createAction('[Auth Service] Check Token Validity Success');
export const checkIsTokenValidFailure = createAction('[Auth Service] Check Token Validity Failure');

export const setNewPassword = createAction('[Auth] Set New Password Requested', props<{ newPassword: NewPassword }>());

export const resetPasswordRequest = createAction('[Auth] Reset Password Requested', props<{ user: User }>());
export const resetPasswordSuccess = createAction('[Auth API] Reset Password Success');

export const activateAccount = createAction('[Auth] Account Activation Requested', props<{ token: string }>());
export const activateAccountSuccess = createAction('[Auth API] Account Activation Success');

export const logOut = createAction('[Auth] Logout');

export const redirectToLogin = createAction('[Auth] Redirect To Login');

export const updateUserProfileRequested = createAction(
  '[My Profile] Update User Profile Requested',
  props<{ user: User }>()
);
export const updateUserProfileSuccess = createAction(
  '[User API]  Update User Profile Success',
  props<{ currentUser: User }>()
);

export const updateUserOrgRequested = createAction(
  '[My Profile] Update User Organization Requested',
  props<{ organization: Organization }>()
);
export const updateUserOrgSuccess = createAction(
  '[User API] Update User Organization Success',
  props<{ organization: Organization }>()
);

export const requestCurrentUser = createAction('[App] Current User Requested');
export const currentUserLoaded = createAction('[Auth API] Current User Loaded', props<{ currentUser: User }>());

export const authApiError = createAction('[Auth API] Executing Request Error');
