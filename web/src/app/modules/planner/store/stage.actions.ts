import { createAction, props } from '@ngrx/store';
import { Stage } from '../models';
import { Update } from '@ngrx/entity';
import { CollectionApiResponse } from '@/shared/models';

export const allStagesRequestedFromDialogWindow = createAction('[Stages Dialog Window] Stages List Requested');

export const allStagesRequestedFromDashboard = createAction('[Dashboard] Stages List Requested');

export const allStagesLoaded = createAction(
  '[Stages API] Stages List Loaded',
  props<{ response: CollectionApiResponse<Stage> }>()
);

export const stageSaved = createAction('[Stages Dialog Window] Stage Saved', props<{ stage: Update<Stage> }>());

export const createStage = createAction(
  '[Stages Dialog Window] New Stage Creation Initialized',
  props<{ stage: Stage }>()
);

export const createStageSuccess = createAction('[Stages API] Create Stage Success', props<{ stage: Stage }>());

export const stageApiError = createAction('[Stage API] Failed Executing Request');
