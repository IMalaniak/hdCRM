import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { denormalize } from 'normalizr';

import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { Page, planListSchema, planSchema } from '@/shared/store';
import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as fromPlan from './plan.reducer';
import { Plan } from '../models';

export const selectPlansState = createFeatureSelector<fromPlan.PlansState>(fromPlan.plansFeatureKey);
export const selectPlanEntityState = createSelector(selectPlansState, (plansState) => plansState?.data);
export const selectPlanPagesState = createSelector(selectPlansState, (plansState) => plansState?.pages);

export const selectPlanById = (planId: number) =>
  createSelector(selectPlanEntityState, (plansState) => plansState?.entities[planId]);
export const selectPlanDeepById = (planId: number) =>
  createSelector(selectPlanById(planId), selectAllUserEntities, (plan, userEntities) => {
    return denormalize(plan, planSchema, { Users: userEntities });
  });
export const selectPlanPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectPlanPagesState, (pagesState) => pagesState?.entities[generatePageKey(pageQuery)]);

export const selectAllPlanIds = createSelector(selectPlanEntityState, fromPlan.selectIds);
export const selectAllPlanEntities = createSelector(selectPlanEntityState, fromPlan.selectEntities);
export const selectAllPlans = createSelector(selectPlanEntityState, fromPlan.selectAll);

export const selectPlansByStage = (stageId: number) =>
  createSelector(selectAllPlans, (plans) => plans.filter((plan) => plan.activeStageId === stageId));

export const selectPlansLoading = createSelector(selectPlansState, (plansState) => plansState.loading);
export const selectPlanPageLoading = createSelector(selectPlanPagesState, (plansState) => plansState?.pageLoading);

export const selectPlansPagesCount = createSelector(selectPlanPagesState, (plansState) => plansState?.pages);

export const selectPlansTotalCount = createSelector(selectPlanPagesState, (plansState) => plansState?.resultsNum);

export const selectPlansOfPage = (pageQuery: PageQuery) =>
  createSelector(
    selectAllPlanEntities,
    selectPlanPageByKey(pageQuery),
    selectAllUserEntities,
    (planEntities: Dictionary<Plan>, page: Page, userEntities) => {
      return page
        ? (denormalize(page.dataIds, planListSchema, { Users: userEntities, Plans: planEntities }) as Plan[])
        : [];
    }
  );

export const selectIsEditing = createSelector(selectPlansState, (plansState) => plansState.editing);
