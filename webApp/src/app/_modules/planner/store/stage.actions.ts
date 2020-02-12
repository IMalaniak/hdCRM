import { createAction, props } from '@ngrx/store';
import { StageServerResponse, Stage } from '../_models';
import { Update } from '@ngrx/entity';

export const allStagesRequestedFromDialogWindow = createAction(
  '[Stages Dialog Window] Stages List Requested',
);

export const allStagesRequestedFromDashboard = createAction(
  '[Dashboard] Stages List Requested',
);

export const allStagesLoaded = createAction(
  '[Stages API] Stages List Loaded',
  props<{ response: StageServerResponse }>()
);

export const stageSaved = createAction(
  '[Stages Dialog Window] Stage Saved',
  props<{ stage: Update<Stage> }>()
);

export const createStage = createAction(
  '[Stages Dialog Window] New Stage Creation Initialized',
  props<{ stage: Stage }>()
);

export const createStageSuccess = createAction(
  '[Stages API] Create Stage Success',
  props<{ stage: Stage }>()
);

export const createStageFail = createAction(
  '[Stages API] Create Stage Fail',
  props<{ error: string }>()
);
