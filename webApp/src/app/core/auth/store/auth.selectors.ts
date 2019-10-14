import {createSelector, createFeatureSelector} from '@ngrx/store';
import { AuthState } from './auth.reducer';

import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '@/_modules/users/_models';
import { Privilege } from '@/_modules/roles';
const jwtHelper = new JwtHelperService();

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const getApiResponse = createSelector(
    selectAuthState,
    auth => auth.apiResp
);

export const isLoading = createSelector(
    selectAuthState,
    auth => auth.loading
);

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
    token => token ? !jwtHelper.isTokenExpired(token) : false
);

export const isloggedIn = createSelector(
    selectAuthState,
    isValidToken,
    (auth, valid) => auth.loggedIn && valid
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
                return {
                    keyString: privilege.keyString,
                    RolePrivilege: privilege.RolePrivilege
                };
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
export const isPrivileged = (privilegeCheck: string) => createSelector(
    getPrivileges,
    privileges => {
        const [symbol, action] = privilegeCheck.split('-');
        if (privileges && privileges.length > 0) {
            const check: Privilege = privileges.find(privilege => {
                return privilege.keyString === symbol;
            });
            return check && check.RolePrivilege && check.RolePrivilege[action];
        } else {
            return false;
        }
    }
);
