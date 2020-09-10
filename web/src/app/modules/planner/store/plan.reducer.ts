import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Plan } from '../models';
import * as planActions from './plan.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface PlansState extends EntityState<Plan> {
  loading: boolean;
  pages: number;
  countAll: number;
  editing: boolean;
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
  editing: false
});

const plansReducer = createReducer(
  initialState,
  on(planActions.changeIsEditingState, (state, { isEditing }) => ({
    ...state,
    editing: isEditing
  })),
  on(
    planActions.listPageRequested,
    planActions.createPlanRequested,
    planActions.updatePlanRequested,
    planActions.deletePlanRequested,
    (state) => ({
      ...state,
      loading: true
    })
  ),
  on(planActions.createPlanSuccess, (state, { plan }) =>
    adapter.addOne(plan, {
      ...state,
      countAll: state.countAll + 1,
      loading: false
    })
  ),
  on(planActions.updatePlanSuccess, (state, { plan }) =>
    adapter.updateOne(plan, { ...state, loading: false, editing: false })
  ),
  on(planActions.deletePlanSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      countAll: state.countAll - 1,
      loading: false
    })
  ),
  on(planActions.planLoaded, (state, { plan }) => adapter.addOne(plan, state)),
  on(planActions.listPageLoaded, (state, { response: { data, pages, resultsNum } }) =>
    adapter.upsertMany(data, {
      ...state,
      loading: false,
      pages: pages,
      countAll: resultsNum
    })
  ),
  on(planActions.planApiError, (state) => ({ ...state, loading: false }))
);

export function reducer(state: PlansState | undefined, action: Action) {
  return plansReducer(state, action);
}

export const plansFeatureKey = 'plans';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
