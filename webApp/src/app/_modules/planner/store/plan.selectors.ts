import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromStage from './stage.reducer';
import * as fromPlan from './plan.reducer';
import { PageQuery } from '@/core/_models';
import { Plan } from '../_models';

export const selectPlansState = createFeatureSelector<fromPlan.PlansState>('plans');

export const selectStagesState = createFeatureSelector<fromStage.StagesState>('stages');

export const selectPlanById = (planId: number) => createSelector(
    selectPlansState,
    plansState => plansState.entities[planId]
);

export const selectAllPlans = createSelector(
  selectPlansState,
  fromPlan.selectAll
);

export const selectPlansByStage = (stageId: number) => createSelector(
    selectAllPlans,
    plans => plans.filter(plan => plan.activeStageId === stageId)
);

export const selectPlansLoading = createSelector(
  selectPlansState,
  plansState => plansState.loading
);

export const selectPlansPagesCount = createSelector(
  selectPlansState,
  plansState => plansState.pages
);

export const selectPlansTotalCount = createSelector(
  selectPlansState,
  plansState => plansState.countAll
);

export const selectPlansPage = (page: PageQuery) => createSelector(
  selectAllPlans,
  selectPlansPagesCount,
  (allPlans: Plan[], pagesCount: number) => {
    if (!pagesCount) {
      return [];
    } else {
      const start = page.pageIndex * page.pageSize,
            end = start + page.pageSize;
      return allPlans.slice(start, end);
    }
  }
);

export const selectAllStages = createSelector(
  selectStagesState,
  fromStage.selectAll
);

export const allStagesLoaded = createSelector(
  selectStagesState,
  stageState => stageState.allStagesLoaded
);

export const selectStagesLoading = createSelector(
  selectStagesState,
  stageState => stageState.loading
);
