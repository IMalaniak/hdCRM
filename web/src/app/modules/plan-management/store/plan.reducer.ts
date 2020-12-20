import { createReducer, on, Action } from '@ngrx/store';

import * as planApiActions from '@/core/modules/plan-api/store/plan/plan.actions';
import { initialListState, ListState, pagesAdapter } from '@/shared/store';
import * as planActions from './plan.actions';

const plansReducer = createReducer(
  initialListState,
  on(planActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(planApiActions.listPageRequested, (state) => ({
    ...state,
    pages: {
      ...state.pages,
      pageLoading: true
    }
  })),
  on(planApiActions.updatePlanSuccess, (state) => ({
    ...state,
    editing: false
  })),
  on(planApiActions.listPageLoaded, (state, { page, response: { pages, resultsNum } }) => ({
    ...state,
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(planApiActions.planApiError, (state) => ({ ...state, pages: { ...state.pages, pageLoading: false } }))
);

export function reducer(state: ListState | undefined, action: Action) {
  return plansReducer(state, action);
}

export const plansFeatureKey = 'plan-management';
