import { createAction, props } from '@ngrx/store';
import { Plan } from '../models';
import { Update } from '@ngrx/entity';
import { PageQuery, CollectionApiResponse } from '@/shared';

export const planRequested = createAction('[Plan Details] Plan Requested', props<{ id: number }>());
export const planLoaded = createAction('[Plans API] Plan Loaded', props<{ plan: Plan }>());

export const updatePlanRequested = createAction('[Plan Details] Update Plan Requsted', props<{ plan: Plan }>());
export const updatePlanSuccess = createAction('[Plan API] Update Plan Success', props<{ plan: Update<Plan> }>());

export const createPlanRequested = createAction('[Add Plan] Add Plan Requested', props<{ plan: Plan }>());
export const createPlanSuccess = createAction('[Plans API] Add Plan Success', props<{ plan: Plan }>());

export const deletePlanRequested = createAction('[Plans List] Delete Plan Requested', props<{ id: number }>());
export const deletePlanSuccess = createAction('[Plans API] Delete Plan Success', props<{ id: number }>());

export const listPageRequested = createAction('[Plans List] Plans Page Requested', props<{ page: PageQuery }>());
export const listPageLoaded = createAction(
  '[Plans API] Plans Page Loaded',
  props<{ response: CollectionApiResponse<Plan> }>()
);

export const changeIsEditingState = createAction(
  '[Plan Details] Change Is Editing State',
  props<{ isEditing: boolean }>()
);

export const planApiError = createAction('[Plan API] Failed Executing Request');
