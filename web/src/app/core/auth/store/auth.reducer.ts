import * as AuthActions from './auth.actions';
import { User } from '@/modules/users';
import { createReducer, Action, on } from '@ngrx/store';

export interface AuthState {
  loggedIn: boolean;
  accessToken: string;
  sessionId: number;
  isTokenValid: boolean;
  isTokenRefreshing: boolean;
  currentUser: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
  accessToken: null,
  sessionId: null,
  isTokenValid: false,
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
    AuthActions.checkIsTokenValid,
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
  on(AuthActions.logInSuccess, (state, { accessToken }) => ({
    ...state,
    loading: false,
    loggedIn: true,
    isTokenValid: true,
    accessToken
  })),
  on(AuthActions.refreshSessionSuccess, (state, { accessToken }) => ({
    ...state,
    loading: false,
    isTokenValid: true,
    isTokenRefreshing: true,
    loggedIn: true,
    accessToken
  })),
  on(AuthActions.refreshSessionFailure, () => ({ ...initialState })),
  on(AuthActions.setSessionId, (state, { sessionId }) => ({ ...state, sessionId })),
  on(AuthActions.checkIsTokenValidSuccess, (state) => ({
    ...state,
    loading: false,
    isTokenValid: true,
    loggedIn: true
  })),
  on(AuthActions.checkIsTokenValidFailure, () => ({ ...initialState })),
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

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}

export const authFeatureKey = 'auth';
