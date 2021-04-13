import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromStage from './stage.reducer';

export const selectStagesState = createFeatureSelector<fromStage.StagesState>(fromStage.stagesFeatureKey);

export const selectAllStages = createSelector(selectStagesState, fromStage.selectAll);

export const allStagesLoaded = createSelector(selectStagesState, (stageState) => stageState.allStagesLoaded);

export const selectStagesLoading = createSelector(selectStagesState, (stageState) => stageState.loading);
