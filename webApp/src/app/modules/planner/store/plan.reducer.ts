import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Plan } from '../models';
import * as PlanActions from './plan.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface PlansState extends EntityState<Plan> {
  loading: boolean;
  pages: number;
  countAll: number;
  error: string;
}

function sortByIdAndActiveStage(p1: Plan, p2: Plan) {
  const compare = p1.id - p2.id;
  if (compare !== 0) {
    return compare;
  } else {
    return p1.activeStageId - p2.activeStageId;
  }
}

const adapter: EntityAdapter<Plan> = createEntityAdapter<Plan>({
  sortComparer: sortByIdAndActiveStage
});

const initialState: PlansState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  error: null
});

const plansReducer = createReducer(
  initialState,
  on(PlanActions.createPlanSuccess, (state, { plan }) =>
    adapter.addOne(plan, {
      ...state,
      countAll: state.countAll + 1
    })
  ),
  on(PlanActions.createPlanFail, (state, { error }) => ({ ...state, error })),
  on(PlanActions.deletePlan, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1
    })
  ),
  on(PlanActions.planLoaded, (state, { plan }) => adapter.addOne(plan, state)),
  on(PlanActions.listPageRequested, state => ({ ...state, loading: true })),
  on(PlanActions.listPageLoaded, (state, { response }) =>
    adapter.upsertMany(response.list, {
      ...state,
      loading: false,
      pages: response.pages,
      countAll: response.count
    })
  ),
  on(PlanActions.listPageCancelled, state => ({ ...state, loading: false })),
  on(PlanActions.planSaved, (state, { plan }) => adapter.updateOne(plan, state))
);

export function reducer(state: PlansState | undefined, action: Action) {
  return plansReducer(state, action);
}

export const plansFeatureKey = 'plans';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
