import { createReducer, Action, on } from '@ngrx/store';

import { User } from '@core/modules/user-api/shared';

import * as AuthActions from './auth.actions';

export interface AuthState {
  loggedIn: boolean;
  accessToken: string;
  tokenType: string;
  sessionId: number;
  isTokenRefreshing: boolean;
  currentUser: User | null;
  loading: boolean;
}

export const initialState: AuthState = {
  loggedIn: false,
  accessToken: null,
  tokenType: null,
  sessionId: null,
  isTokenRefreshing: false,
  currentUser: null,
  loading: false
};

const authReducer = createReducer(
  initialState,
  on(
    AuthActions.registerUser,
    AuthActions.logIn,
    AuthActions.refreshSession,
    AuthActions.deleteSession,
    AuthActions.deleteMultipleSession,
    AuthActions.setNewPassword,
    AuthActions.resetPasswordRequest,
    AuthActions.activateAccount,
    AuthActions.requestCurrentUser,
    AuthActions.updateUserOrgRequested,
    AuthActions.updateUserProfileRequested,
    (state) => ({ ...state, loading: true })
  ),
  on(AuthActions.registerSuccess, AuthActions.deleteSessionSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(AuthActions.logInSuccess, (state, { accessToken, tokenType, sessionId }) => ({
    ...state,
    loading: false,
    loggedIn: true,
    accessToken,
    tokenType,
    sessionId
  })),
  on(AuthActions.refreshSessionSuccess, (state, { accessToken, tokenType, sessionId }) => ({
    ...state,
    loading: false,
    isTokenRefreshing: true,
    loggedIn: true,
    accessToken,
    tokenType,
    sessionId
  })),
  on(AuthActions.refreshSessionFailure, () => ({ ...initialState })),
  on(AuthActions.logOut, () => ({ ...initialState })),
  on(AuthActions.currentUserLoaded, (state, { currentUser }) => ({ ...state, currentUser, loading: false })),
  on(AuthActions.updateUserProfileSuccess, (state, { currentUser }) => ({ ...state, currentUser, loading: false })),
  on(AuthActions.updateUserOrgSuccess, (state: AuthState, { organization }) => {
    const currentUser = { ...state.currentUser };
    currentUser.Organization = organization;
    return { ...state, currentUser };
  }),
  on(AuthActions.resetPasswordSuccess, AuthActions.activateAccountSuccess, AuthActions.authApiError, (state) => ({
    ...state,
    loading: false
  }))
);

export const reducer = (state: AuthState | undefined, action: Action) => authReducer(state, action);

export const authFeatureKey = 'auth';
