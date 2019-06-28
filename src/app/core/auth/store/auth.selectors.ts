import {createSelector, createFeatureSelector} from '@ngrx/store';
import { AuthState } from './auth.reducer';

import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '@/_modules/users/_models';
const jwtHelper = new JwtHelperService();

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const currentUser = createSelector(
    selectAuthState,
    auth => new User(auth.currentUser)
);

export const getToken = createSelector(
    currentUser,
    user => user.token
);

export const isValidToken = createSelector(
    getToken,
    token => !jwtHelper.isTokenExpired(token)
);

export const isloggedIn = createSelector(
    selectAuthState,
    auth => auth.loggedIn
);

export const isLoggedOut = createSelector(
    isloggedIn,
    loggedIn => !loggedIn
);

// get an array pf currentUser privileges
export const getPrivileges = createSelector(
    currentUser,
    user => {
        if (user.Roles && user.Roles.length > 0) {
            let privileges = [];
            for (const role of user.Roles) {
              privileges.push(role.Privileges.map(privilege => {
                return privilege.keyString;
              }));
            }
            privileges = [].concat(...privileges);
            privileges = privileges.filter((v, i, a) => a.indexOf(v) === i);
            return privileges;
        } else {
            return [];
        }
    }
);

// check if currentUser has privilege
export const isPrivileged = (privilege: string) => createSelector(
    getPrivileges,
    privileges => {
        if (privileges && privilege.length > 0) {
            return privileges.includes(privilege);
        } else {
            return false;
        }
    }
);
