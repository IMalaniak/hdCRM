import { Action, createReducer, on } from '@ngrx/store';

import * as roleApiActions from '@/core/modules/role-api/store/role/role.actions';
import { initialListState, ListState, pagesAdapter } from '@/shared/store';
import * as roleActions from './role.actions';

const rolesReducer = createReducer(
  initialListState,
  on(roleActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(roleApiActions.listPageRequested, (state) => ({
    ...state,
    pages: {
      ...state.pages,
      pageLoading: true
    }
  })),
  on(roleApiActions.createRoleSuccess, (state) => ({
    ...state,
    pages: initialListState.pages
  })),
  on(roleApiActions.listPageLoaded, (state, { page, response: { pages, resultsNum } }) => ({
    ...state,
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(roleApiActions.deleteRoleSuccess, (state) => ({
    ...state,
    pages: initialListState.pages
  })),
  on(roleApiActions.updateRoleSuccess, (state) => ({
    ...state,
    editing: false
  })),
  on(roleApiActions.rolesApiError, (state) => ({
    ...state,
    pages: { ...state.pages, pageLoading: false }
  }))
);

export function reducer(state: ListState | undefined, action: Action) {
  return rolesReducer(state, action);
}

export const rolesFeatureKey = 'role-management';
