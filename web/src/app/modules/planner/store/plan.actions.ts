import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Page } from '@/shared/store';
import { PageQuery, CollectionApiResponse } from '@/shared/models';
import { Plan } from '../models';

const detailsPrefix = '[Plan Details]';
const listPrefix = '[Plans List]';
const apiPrefix = '[Plans API]';

export const planRequested = createAction(`${detailsPrefix} Plan Requested`, props<{ id: number }>());
export const planLoaded = createAction(`${apiPrefix} Plan Loaded`, props<{ plan: Plan }>());

export const updatePlanRequested = createAction(`${detailsPrefix} Update Plan Requsted`, props<{ plan: Plan }>());
export const updatePlanSuccess = createAction(`${apiPrefix} Update Plan Success`, props<{ plan: Update<Plan> }>());

export const createPlanRequested = createAction('[Add Plan] Add Plan Requested', props<{ plan: Plan }>());
export const createPlanSuccess = createAction(`${apiPrefix} Add Plan Success`, props<{ plan: Plan }>());

export const deletePlanRequested = createAction(`${listPrefix} Delete Plan Requested`, props<{ id: number }>());
export const deletePlanSuccess = createAction(`${apiPrefix} Delete Plan Success`, props<{ id: number }>());

export const listPageRequested = createAction(`${listPrefix} Plans Page Requested`, props<{ page: PageQuery }>());
export const listPageLoaded = createAction(
  `${apiPrefix} Plans Page Loaded`,
  props<{ response: CollectionApiResponse<Plan>; page: Page }>()
);

export const changeIsEditingState = createAction(
  `${detailsPrefix} Change Is Editing State`,
  props<{ isEditing: boolean }>()
);

export const planApiError = createAction(`${apiPrefix} Failed Executing Request`);
