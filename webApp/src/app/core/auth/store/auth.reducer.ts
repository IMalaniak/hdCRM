import * as AuthActions from './auth.actions';
import { User } from '@/modules/users';
import { ApiResponse } from '@/shared';
import { createReducer, Action, on } from '@ngrx/store';

export interface AuthState {
  loggedIn: boolean;
  accessToken: string;
  currentUser: User | null;
  apiResp: ApiResponse;
  loading: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
  accessToken: null,
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
  on(AuthActions.logInSuccess, (state, { accessToken }) => ({ ...state, loading: false, loggedIn: true, accessToken })),
  on(AuthActions.logInFailure, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.refreshSession, state => ({ ...state, loading: true })),
  on(AuthActions.refreshSessionSuccess, (state, { accessToken }) => ({
    ...state,
    loading: false,
    loggedIn: true,
    accessToken
  })),
  on(AuthActions.refreshSessionFailure, () => ({ ...initialState })),
  on(AuthActions.logOut, () => ({ ...initialState })),
  on(AuthActions.setNewPassword, state => ({ ...state, loading: true })),
  on(AuthActions.resetPasswordRequest, state => ({ ...state, loading: true })),
  on(AuthActions.resetPasswordSuccess, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.resetPasswordFailure, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.activateAccount, state => ({ ...state, loading: true })),
  on(AuthActions.activateAccountSuccess, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.activateAccountFailure, (state, { response }) => ({ ...state, loading: false, apiResp: response })),
  on(AuthActions.profileSaved, (state, { user }) => ({ ...state, currentUser: user })),
  on(AuthActions.requestCurrentUser, state => ({ ...state, loading: true })),
  on(AuthActions.currentUserLoaded, (state, { currentUser }) => ({ ...state, currentUser })),
  on(AuthActions.currentUserLoadFailed, (state, { response }) => ({ ...state, apiResp: response }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}

export const authFeatureKey = 'auth';
