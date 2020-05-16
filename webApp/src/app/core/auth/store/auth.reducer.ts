import * as AuthActions from './auth.actions';
import { User } from '@/modules/users';
import { ApiResponse } from '@/shared';
import { createReducer, Action, on } from '@ngrx/store';

export interface AuthState {
  loggedIn: boolean;
  currentUser: User | null;
  apiResp: ApiResponse;
  loading: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
  currentUser: null,
  apiResp: null,
  loading: false
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.registerUser, state => ({ ...state, loading: true })),
  on(AuthActions.registerSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.registerFailure, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.logIn, state => ({ ...state, loading: true })),
  on(AuthActions.logInSuccess, (state, { user }) => ({ ...state, loading: false, loggedIn: true, currentUser: user })),
  on(AuthActions.logInFailure, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.logOut, () => ({ ...initialState })),
  on(AuthActions.setNewPassword, state => ({ ...state, loading: true })),
  on(AuthActions.resetPasswordRequest, state => ({ ...state, loading: true })),
  on(AuthActions.resetPasswordSuccess, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.resetPasswordFailure, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.activateAccount, state => ({ ...state, loading: true })),
  on(AuthActions.activateAccountSuccess, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.activateAccountFailure, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.profileSaved, (state, { user }) => ({ ...state, currentUser: user }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}

export const authFeatureKey = 'auth';
