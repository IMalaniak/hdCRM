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

    case PlanActionTypes.PLAN_CREATE_SUCCESS:
      return adapter.addOne(action.payload.plan, {...state, countAll: state.countAll + 1});

    case PlanActionTypes.PLAN_CREATE_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case PlanActionTypes.DELETE_PLAN:
      return adapter.removeOne(action.payload.planId, {...state, countAll: state.countAll - 1});

    case PlanActionTypes.PLAN_LOADED:
      return adapter.addOne(action.payload.plan, state);

    case PlanActionTypes.PLAN_LIST_PAGE_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case PlanActionTypes.PLAN_LIST_PAGE_LOADED:
      return adapter.upsertMany(action.payload.list, {...state, loading: false, pages: action.payload.pages, countAll: action.payload.count});

    case PlanActionTypes.PLAN_LIST_PAGE_CANCELLED:
      return {
        ...state,
        loading: false
      };

    case PlanActionTypes.PLAN_SAVED:
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
