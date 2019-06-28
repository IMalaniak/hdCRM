import { Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Plan } from '../_models';
import { PlanActions, PlanActionTypes } from './plan.actions';


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

export const adapter: EntityAdapter<Plan> = createEntityAdapter<Plan>({
  sortComparer: sortByIdAndActiveStage
});


export const initialPlansState: PlansState = adapter.getInitialState({
  loading: false,
  pages: null,
  countAll: null,
  error: null
});


export function plansReducer(state = initialPlansState , action: PlanActions): PlansState {

  switch (action.type) {

    case PlanActionTypes.CreatePlanSuccess:
      return adapter.addOne(action.payload.plan, state);

    case PlanActionTypes.CreatePlanFail:
      return {
        ...state,
        error: action.payload
      };

    case PlanActionTypes.PlanLoaded:
      return adapter.addOne(action.payload.plan, state);

    case PlanActionTypes.ListPageRequested:
      return {
        ...state,
        loading: true
      };

    case PlanActionTypes.ListPageLoaded:
      return adapter.upsertMany(action.payload.list, {...state, loading: false, pages: action.payload.pages, countAll: action.payload.count});

    case PlanActionTypes.ListPageCancelled:
      return {
        ...state,
        loading: false
      };

    case PlanActionTypes.PlanSaved:
      return adapter.updateOne(action.payload.plan, state);

    default: {
      return state;
    }

  }
}


export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
