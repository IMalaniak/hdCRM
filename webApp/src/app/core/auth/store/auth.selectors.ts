import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState, authFeatureKey } from './auth.reducer';

import { Privilege } from '@/modules/roles';
import { User } from '@/modules/users';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const isLoading = createSelector(selectAuthState, auth => auth.loading);

export const currentUser = createSelector(selectAuthState, auth => auth.currentUser);

export const getToken = createSelector(selectAuthState, auth => auth.accessToken);

export const getSessionId = createSelector(selectAuthState, auth => auth.sessionId);

export const isTokenRefreshing = createSelector(selectAuthState, auth => auth.isTokenRefreshing);

export const isTokenValid = createSelector(selectAuthState, auth => auth.isTokenValid);

export const isLoggedIn = createSelector(selectAuthState, isTokenValid, (auth, valid) => auth.loggedIn && valid);

export const isLoggedOut = createSelector(isLoggedIn, loggedIn => !loggedIn);

// get an array pf currentUser privileges
export const getPrivileges = createSelector<object, User, Privilege[]>(currentUser, user => {
  if (user && user.Roles && user.Roles.length > 0) {
    let privileges = [];
    for (const role of user.Roles) {
      privileges.push(
        role.Privileges.map(privilege => {
          return {
            keyString: privilege.keyString,
            RolePrivilege: privilege.RolePrivilege
          };
        })
      );
    }
    privileges = [].concat(...privileges);
    privileges = privileges.filter((v, i, a) => a.indexOf(v) === i);
    return privileges;
  }
});

// check if currentUser has privilege
export const isPrivileged = (privilegeCheck: string) =>
  createSelector<object, Privilege[], boolean>(getPrivileges, privileges => {
    if (privileges && privileges.length > 0) {
      const [symbol, action] = privilegeCheck.split('-');
      const check: Privilege = privileges.find(privilege => {
        return privilege.keyString === symbol;
      });
      return check && check.RolePrivilege && check.RolePrivilege[action];
    }
  });
