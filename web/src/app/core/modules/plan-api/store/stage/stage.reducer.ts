import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import { Stage } from '../../shared/models';
import * as StageActions from './stage.actions';

export interface StagesState extends EntityState<Stage> {
  allStagesLoaded: boolean;
  loading: boolean;
}

const adapter: EntityAdapter<Stage> = createEntityAdapter<Stage>();

export const initialStagesState: StagesState = adapter.getInitialState({
  allStagesLoaded: false,
  loading: false
});

const reducer = createReducer(
  initialStagesState,
  on(StageActions.createStageSuccess, (state, { stage }) => adapter.addOne(stage, state)),
  on(StageActions.allStagesRequestedFromDashboard || StageActions.allStagesRequestedFromDialogWindow, (state) => ({
    ...state,
    loading: true
  })),
  on(StageActions.allStagesApiLoaded, (state, { response }) =>
    adapter.setAll(response.data, {
      ...state,
      allStagesLoaded: true,
      loading: false
    })
  ),
  on(StageActions.stageSaved, (state, { stage }) => adapter.updateOne(stage, state)),
  on(StageActions.stageApiError, (state) => ({ ...state, loading: false }))
);

export const stagesReducer = (state: StagesState | undefined, action: Action) => reducer(state, action);

export const stagesFeatureKey = 'stage-api';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
