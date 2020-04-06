import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Stage } from '../models';
import * as StageActions from './stage.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface StagesState extends EntityState<Stage> {
  allStagesLoaded: boolean;
  error: string;
  loading: boolean;
}

const adapter: EntityAdapter<Stage> = createEntityAdapter<Stage>();

const initialState: StagesState = adapter.getInitialState({
  allStagesLoaded: false,
  error: null,
  loading: false
});

const stagesReducer = createReducer(
  initialState,
  on(StageActions.createStageSuccess, (state, { stage }) => adapter.addOne(stage, state)),
  on(StageActions.createStageFail, (state, { error }) => ({ ...state, error })),
  on(StageActions.allStagesRequestedFromDashboard || StageActions.allStagesRequestedFromDialogWindow, state => ({
    ...state,
    loading: true
  })),
  on(StageActions.allStagesLoaded, (state, { response }) =>
    adapter.addAll(response.list, {
      ...state,
      allStagesLoaded: true,
      loading: false
    })
  ),
  on(StageActions.stageSaved, (state, { stage }) => adapter.updateOne(stage, state))
);

export function reducer(state: StagesState | undefined, action: Action) {
  return stagesReducer(state, action);
}

export const stagesFeatureKey = 'stages';

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
