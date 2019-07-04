
import { AuthActionTypes, AuthActions } from './auth.actions';
import { User } from '@/_modules/users';
import { ApiResponse } from '@/core/_models';


export interface AuthState {
  loggedIn: boolean;
  currentUser: User | null;
  apiResp: ApiResponse;
}

export const initialState: AuthState = {
  loggedIn: false,
  currentUser: null,
  apiResp: null
};

export function authReducer(state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        loggedIn: true,
        currentUser:  action.payload
      };
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        apiResp: action.payload
      };
    }
    // case AuthActionTypes.SIGNUP_SUCCESS: {
    //   return {
    //     ...state,
    //     isAuthenticated: true,
    //     user: {
    //       token: action.payload.token,
    //       email: action.payload.email
    //     },
    //     apiResp: null
    //   };
    // }
    // case AuthActionTypes.SIGNUP_FAILURE: {
    //   return {
    //     ...state,
    //     apiResp: 'That email is already in use.'
    //   };
    // }
    case AuthActionTypes.LOGOUT: {
      return initialState;
    }

    case AuthActionTypes.PROFILE_SAVED:
      return {
        ...state,
        currentUser: action.payload.user
      };

    default: {
      return state;
    }
  }
}