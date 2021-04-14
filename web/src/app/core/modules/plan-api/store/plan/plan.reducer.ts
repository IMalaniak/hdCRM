import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import { Plan } from '../../shared/models';

import * as planActions from './plan.actions';

export interface PlansState extends EntityState<Plan> {
  loading: boolean;
}

const plansAdapter: EntityAdapter<Plan> = createEntityAdapter<Plan>({
  sortComparer: false
});

export const initialPlansState: PlansState = plansAdapter.getInitialState({
  loading: false
});

const reducer = createReducer(
  initialPlansState,
  on(planActions.createPlanRequested, planActions.updatePlanRequested, planActions.deletePlanRequested, (state) => ({
    ...state,
    loading: true
  })),
  on(planActions.listPageRequested, (state) => ({
    ...state
  })),
  on(planActions.createPlanSuccess, (state, { plan }) =>
    plansAdapter.addOne(plan, {
      ...state,
      loading: false
    })
  ),
  on(planActions.updatePlanSuccess, (state, { plan }) =>
    plansAdapter.updateOne(plan, {
      ...state,
      loading: false
    })
  ),
  on(planActions.deletePlanSuccess, (state, { id }) =>
    plansAdapter.removeOne(id, {
      ...state,
      loading: false
    })
  ),
  on(planActions.planLoaded, (state, { plan }) =>
    plansAdapter.addOne(plan, {
      ...state,
      loading: false
    })
  ),
  on(planActions.listPageLoaded, (state, { response: { data } }) =>
    plansAdapter.upsertMany(data, {
      ...state,
      loading: false
    })
  ),
  on(planActions.planApiError, (state) => ({ ...state, loading: false }))
);

export const plansReducer = (state: PlansState | undefined, action: Action) => reducer(state, action);

export const plansFeatureKey = 'plan-api';

export const { selectAll, selectEntities, selectIds, selectTotal } = plansAdapter.getSelectors();
