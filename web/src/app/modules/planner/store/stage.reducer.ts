import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Stage } from '../models';
import * as StageActions from './stage.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface StagesState extends EntityState<Stage> {
  allStagesLoaded: boolean;
  loading: boolean;
}

const adapter: EntityAdapter<Stage> = createEntityAdapter<Stage>();

export const initialStagesState: StagesState = adapter.getInitialState({
  allStagesLoaded: false,
  loading: false
});

const stagesReducer = createReducer(
  initialStagesState,
  on(StageActions.createStageSuccess, (state, { stage }) => adapter.addOne(stage, state)),
  on(StageActions.allStagesRequestedFromDashboard || StageActions.allStagesRequestedFromDialogWindow, (state) => ({
    ...state,
    loading: true
  })),
  on(StageActions.allStagesLoaded, (state, { response }) =>
    adapter.setAll(response.data, {
      ...state,
      allStagesLoaded: true,
      loading: false
    })
  ),
  on(StageActions.stageSaved, (state, { stage }) => adapter.updateOne(stage, state)),
  on(StageActions.stageApiError, (state) => ({ ...state, loading: false }))
);

export function reducer(state: StagesState | undefined, action: Action) {
  return stagesReducer(state, action);
}

export const stagesFeatureKey = 'stages';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
