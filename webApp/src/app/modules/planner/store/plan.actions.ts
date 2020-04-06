import { createAction, props } from '@ngrx/store';
import { Plan, PlanServerResponse } from '../models';
import { Update } from '@ngrx/entity';
import { PageQuery } from '@/shared';

export const planRequested = createAction(
  '[Plan Details] Plan Requested',
  props<{ id: number }>()
);

export const planLoaded = createAction(
  '[Plans API] Plan Loaded',
  props<{ plan: Plan }>()
);

export const planSaved = createAction(
  '[Plan Details] Plan Changes Saved',
  props<{ plan: Update<Plan> }>()
);

export const createPlan = createAction(
  '[Add Plan] Add Plan Requested',
  props<{ plan: Plan }>()
);

export const createPlanSuccess = createAction(
  '[Plans API] Add Plan Success',
  props<{ plan: Plan }>()
);

export const createPlanFail = createAction(
  '[Plans API] Add Plan Fail',
  props<{ error: string }>()
);

export const deletePlan = createAction(
  '[Plans List] Delete Plan Requested',
  props<{ id: number }>()
);

export const listPageRequested = createAction(
  '[Plans List] Plans Page Requested',
  props<{ page: PageQuery }>()
);

export const listPageLoaded = createAction(
  '[Plans API] Plans Page Loaded',
  props<{ response: PlanServerResponse }>()
);

export const listPageCancelled = createAction(
  '[Plans API] Plans Page Cancelled'
);
