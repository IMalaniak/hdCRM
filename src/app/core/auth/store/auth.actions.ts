import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { User } from '@/_modules/users/_models';
import { ApiResponse } from '@/core/_models';


export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth API] Login Success',
  LOGIN_FAILURE = '[Auth API] Login Failure',
  SIGNUP = '[Auth] Signup',
  SIGNUP_SUCCESS = '[Auth API] Signup Success',
  SIGNUP_FAILURE = '[Auth API] Signup Failure',
  RESET_PASSWORD = '[Auth] Reset Password Requested',
  RESET_PASSWORD_SUCCESS = '[Auth API] Reset Password Success',
  RESET_PASSWORD_FAILURE = '[Auth API] Reset Password Failure',
  LOGOUT = '[Auth] Logout',
  GET_STATUS = '[Auth] GetStatus',
  PROFILE_SAVED = '[My Profile] Profile saved'
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;
  constructor(public payload: User) {}
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(public payload: User) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: ApiResponse) {}
}

// export class SignUp implements Action {
//   readonly type = AuthActionTypes.SIGNUP;
//   constructor(public payload: any) {}
// }

// export class SignUpSuccess implements Action {
//   readonly type = AuthActionTypes.SIGNUP_SUCCESS;
//   constructor(public payload: any) {}
// }

// export class SignUpFailure implements Action {
//   readonly type = AuthActionTypes.SIGNUP_FAILURE;
//   constructor(public payload: any) {}
// }

export class ResetPassword implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD;
  constructor(public payload: User) {}
}

export class ResetPasswordSuccess implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD_SUCCESS;
  constructor(public payload: ApiResponse) {}
}

export class ResetPasswordFailure implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD_FAILURE;
  constructor(public payload: ApiResponse) {}
}

export class LogOut implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class GetStatus implements Action {
  readonly type = AuthActionTypes.GET_STATUS;
}

export class ProfileSaved implements Action {
  readonly type = AuthActionTypes.PROFILE_SAVED;
  constructor(public payload: {user: User}) {}
}

export type AuthActions =
  | LogIn
  | LogInSuccess
  | LogInFailure
  // | SignUp
  // | SignUpSuccess
  // | SignUpFailure
  | ResetPassword
  | ResetPasswordSuccess
  | ResetPasswordFailure
  | LogOut
  | GetStatus
  | ProfileSaved;
