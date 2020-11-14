import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { getInitialPaginationState, pagesAdapter, PaginationState } from '@/shared/store/pagination';
import { Plan } from '../models';
import * as planActions from './plan.actions';

export interface PlansEntityState extends EntityState<Plan> {}

export interface PlansState extends PaginationState<PlansEntityState> {}

const plansAdapter: EntityAdapter<Plan> = createEntityAdapter<Plan>({
  sortComparer: false
});

const initialPlansEntityState: PlansEntityState = plansAdapter.getInitialState();

export const initialPlansState: PlansState = getInitialPaginationState<PlansEntityState, PlansState>(
  initialPlansEntityState
);

const plansReducer = createReducer(
  initialPlansState,
  on(planActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(planActions.createPlanRequested, planActions.updatePlanRequested, planActions.deletePlanRequested, (state) => ({
    ...state,
    loading: true
  })),
  on(planActions.listPageRequested, (state) => ({
    ...state,
    pages: {
      ...state.pages,
      pageLoading: true
    }
  })),
  on(planActions.createPlanSuccess, (state, { plan }) => ({
    ...state,
    loading: false,
    data: plansAdapter.addOne(plan, {
      ...state.data
    })
  })),
  on(planActions.updatePlanSuccess, (state, { plan }) => ({
    ...state,
    loading: false,
    editing: false,
    data: plansAdapter.updateOne(plan, { ...state.data })
  })),
  on(planActions.deletePlanSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    data: plansAdapter.removeOne(id, {
      ...state.data
    })
  })),
  on(planActions.planLoaded, (state, { plan }) => ({
    ...state,
    loading: false,
    data: plansAdapter.addOne(plan, { ...state.data })
  })),
  on(planActions.listPageLoaded, (state, { page, response: { data, pages, resultsNum } }) => ({
    ...state,
    data: plansAdapter.upsertMany(data, {
      ...state.data
    }),
    pages: pagesAdapter.addOne(page, {
      ...state.pages,
      resultsNum,
      pages,
      pageLoading: false
    })
  })),
  on(planActions.planApiError, (state) => ({ ...state, loading: false }))
);

export function reducer(state: PlansState | undefined, action: Action) {
  return plansReducer(state, action);
}

export const plansFeatureKey = 'plan';

export const { selectAll, selectEntities, selectIds, selectTotal } = plansAdapter.getSelectors();
