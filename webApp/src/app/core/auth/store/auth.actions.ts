import { props, createAction } from '@ngrx/store';
import { User } from '@/modules/users/models';
import { ApiResponse } from '@/shared';

export const logIn = createAction(
  '[Auth] Login',
  props<{ user: User }>()
);

export const logInSuccess = createAction(
  '[Auth API] Login Success',
  props<{ user: User }>()
);

export const logInFailure = createAction(
  '[Auth API] Login Failure',
  props<{ response: ApiResponse }>()
);

export const resetPassword = createAction(
  '[Auth] Reset Password Requested',
  props<{ user: User }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth API] Reset Password Success',
  props<{ response: ApiResponse }>()
);

export const resetPasswordFailure = createAction(
  '[Auth API] Reset Password Failure',
  props<{ response: ApiResponse }>()
);

export const logOut = createAction(
  '[Auth] Logout'
);

export const redirectToLogin = createAction(
  '[Auth] Redirect to login',
  props<{ returnUrl: string }>()
);

export const getStatus = createAction(
  '[Auth] GetStatus'
);

export const profileSaved = createAction(
  '[My Profile] Profile saved',
  props<{ user: User }>()
);
