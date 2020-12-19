import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { denormalize } from 'normalizr';

import { planListSchema } from '@/core/store/normalization';
import { Plan } from '@/core/modules/plan-api/shared';
import { selectAllPlanEntities } from '@/core/modules/plan-api/store/plan/plan.selectors';
import { selectAllUserEntities } from '@/core/modules/user-api/store';
import { ListState, Page } from '@/shared/store';
import { PageQuery } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { plansFeatureKey } from './plan.reducer';

export const selectPlansState = createFeatureSelector<ListState>(plansFeatureKey);
export const selectPlanPagesState = createSelector(selectPlansState, (plansState) => plansState?.pages);

export const selectPlanPageByKey = (pageQuery: PageQuery) =>
  createSelector(selectPlanPagesState, (pagesState) => pagesState?.entities[generatePageKey(pageQuery)]);

export const selectPlanPageLoading = createSelector(selectPlanPagesState, (plansState) => plansState?.pageLoading);
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

export const selectIsEditing = createSelector(selectPlansState, (plansState) => plansState?.editing);
