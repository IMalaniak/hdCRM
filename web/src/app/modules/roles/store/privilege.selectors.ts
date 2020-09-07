import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromPrivilege from './privilege.reducer';

export const selectPrivilegesState = createFeatureSelector<fromPrivilege.PrivilegesState>(
  fromPrivilege.privilegesFeatureKey
);

export const selectAllPrivileges = createSelector(selectPrivilegesState, fromPrivilege.selectAll);

export const allPrivilegesLoaded = createSelector(
  selectPrivilegesState,
  (privilegeState) => privilegeState.allPrivilegesLoaded
);

export const selectPrivilegesLoading = createSelector(
  selectPrivilegesState,
  (privilegeState) => privilegeState.loading
);
