
import { AuthActionTypes, AuthActions } from './auth.actions';
import { User } from '@/_modules/users';


export interface AuthState {
  loggedIn: boolean;
  currentUser: User | null;
  errorMessage: string | null;
}

export const initialState: AuthState = {
  loggedIn: false,
  currentUser: null,
  errorMessage: null
};

export function authReducer(state = initialState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        loggedIn: true,
        currentUser:  action.payload,
        errorMessage: null
      };
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect email and/or password.'
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
    //     errorMessage: null
    //   };
    // }
    // case AuthActionTypes.SIGNUP_FAILURE: {
    //   return {
    //     ...state,
    //     errorMessage: 'That email is already in use.'
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