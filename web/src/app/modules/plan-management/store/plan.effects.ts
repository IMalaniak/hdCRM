import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { withLatestFrom, switchMap, map } from 'rxjs/operators';

import { Plan } from '@core/modules/plan-api/shared';
import { selectPlanById } from '@core/modules/plan-api/store/plan';
import * as planApiActions from '@core/modules/plan-api/store/plan/plan.actions';
import { AppState } from '@core/store';

import * as planActions from './plan.actions';
import { selectPlanFromCache } from './plan.selectors';

@Injectable()
export class PlanEffects {
  cachePlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.cachePlan),
      map((payload) => payload.id),
      switchMap((id: number) =>
        this.store$
          .pipe(select(selectPlanById(id)))
          .pipe(map((displayedItemCopy) => planActions.planCached({ displayedItemCopy })))
      )
    )
  );

  restorePlanFromCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.restoreFromCache),
      withLatestFrom(this.store$.pipe(select(selectPlanFromCache))),
      switchMap(([_, planCopy]) => {
        const plan: Update<Plan> = {
          id: planCopy.id,
          changes: planCopy
        };
        return [planApiActions.updatePlanSuccess({ plan })];
      })
    )
  );

  constructor(private readonly actions$: Actions, private readonly store$: Store<AppState>) {}
}
