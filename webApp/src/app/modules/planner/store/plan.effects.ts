import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as planActions from './plan.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PlanService } from '../services';
import { AppState } from '@/core/reducers';
import { PlanServerResponse, Plan } from '../models';
import { Router } from '@angular/router';
import { ToastMessageService } from '@/shared';

@Injectable()
export class PlanEffects {
  createPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.createPlan),
      map(payload => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create(plan).pipe(
          map(newPlan => {
            this.toastMessageService.popup('Plan created!', 'success', 1500);
            this.router.navigate(['/planner']);
            return planActions.createPlanSuccess({ plan: newPlan });
          }),
          catchError(error => {
            this.toastMessageService.popup('Ooops, something went wrong!', 'error', 1500);
            return of(planActions.createPlanFail({ error }));
          })
        )
      )
    )
  );

  loadPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.planRequested),
      map(payload => payload.id),
      mergeMap(id => this.planService.getOne(id)),
      map(plan => planActions.planLoaded({ plan }))
    )
  );

  loadPlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.listPageRequested),
      map(payload => payload.page),
      mergeMap(page =>
        this.planService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: PlanServerResponse) => planActions.listPageLoaded({ response })),
          catchError(err => of(planActions.listPageCancelled()))
        )
      )
    )
  );

  deletePlan$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(planActions.deletePlan),
        map(payload => payload.id),
        mergeMap(id => this.planService.delete(id)),
        map(() => of(this.toastMessageService.toast('Plan deleted!', 'success')))
      ),
    {
      dispatch: false
    }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private planService: PlanService,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}
}
