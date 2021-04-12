import { createFeatureSelector, createSelector } from '@ngrx/store';
import { denormalize } from 'normalizr';

import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { planSchema } from '@/core/store/normalization';
import * as fromPlan from './plan.reducer';

export const selectPlansState = createFeatureSelector<fromPlan.PlansState>(fromPlan.plansFeatureKey);

export const selectPlanById = (planId: number) =>
  createSelector(selectPlansState, (plansState) => plansState?.entities[planId]);
export const selectPlanDeepById = (planId: number) =>
  createSelector(selectPlanById(planId), selectAllUserEntities, (plan, userEntities) =>
    denormalize(plan, planSchema, { Users: userEntities })
  );

export const selectAllPlanIds = createSelector(selectPlansState, fromPlan.selectIds);
export const selectAllPlanEntities = createSelector(selectPlansState, fromPlan.selectEntities);
export const selectAllPlans = createSelector(selectPlansState, fromPlan.selectAll);

export const selectPlansByStage = (stageId: number) =>
  createSelector(selectAllPlans, (plans) => plans.filter((plan) => plan.activeStageId === stageId));

export const selectPlansLoading = createSelector(selectPlansState, (plansState) => plansState.loading);
