import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { CollectionApiResponse } from '@shared/models';

import { Stage } from '../../shared/models';

const listPrefix = '[Stages List]';
const apiPrefix = '[Stages API]';

export const allStagesRequestedFromDialogWindow = createAction(`${listPrefix} Stages List Requested`);

export const allStagesRequestedFromDashboard = createAction('[Dashboard] Stages List Requested');

export const allStagesApiLoaded = createAction(
  `${apiPrefix} Stages List Loaded`,
  props<{ response: CollectionApiResponse<Stage> }>()
);

export const stageSaved = createAction(`${listPrefix} Stage Saved`, props<{ stage: Update<Stage> }>());

export const createStage = createAction(`${listPrefix} New Stage Creation Initialized`, props<{ stage: Stage }>());

export const createStageSuccess = createAction(`${apiPrefix} Create Stage Success`, props<{ stage: Stage }>());

export const stageApiError = createAction(`${apiPrefix} Failed Executing Request`);
