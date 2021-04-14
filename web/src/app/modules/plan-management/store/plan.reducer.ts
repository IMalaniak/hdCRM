import { createReducer, on, Action } from '@ngrx/store';

import { Plan } from '@core/modules/plan-api/shared';
import * as planApiActions from '@core/modules/plan-api/store/plan/plan.actions';
import { initialListState, ListState, pagesAdapter } from '@shared/store';

import * as planActions from './plan.actions';

const plansReducer = createReducer(
  initialListState,
  on(planActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    isEditing
  })),
  on(planActions.planCached, (state, { displayedItemCopy }) => ({
    ...state,
    cache: {
      ...state.cache,
      displayedItemCopy
    }
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
    isEditing: false
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

export const reducer = (state: ListState<Plan> | undefined, action: Action) => plansReducer(state, action);

export const plansFeatureKey = 'plan-management';
