import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as planActions from './plan.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PlanService } from '../_services';
import { AppState } from '@/core/reducers';
import { PlanServerResponse, Plan } from '../_models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class PlanEffects {
  createPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.createPlan),
      map(payload => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create(plan).pipe(
          map(newPlan => {
            Swal.fire({
              title: 'Plan created!',
              icon: 'success',
              timer: 1500
            });
            this.router.navigate(['/planner']);
            return planActions.createPlanSuccess({ plan: newPlan });
          }),
          catchError(error => {
            Swal.fire({
              title: 'Ooops, something went wrong!',
              icon: 'error',
              timer: 1500
            });
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
          catchError(err => {
            this.store.dispatch(planActions.listPageCancelled());
            return of(new PlanServerResponse());
          })
        )
      ),
      map((response: PlanServerResponse) => planActions.listPageLoaded({ response }))
    )
  );

  deletePlan$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(planActions.deletePlan),
        map(payload => payload.id),
        mergeMap(id => this.planService.delete(id)),
        map(() =>
          of(
            Swal.fire({
              text: `Plan deleted`,
              icon: 'success',
              timer: 6000,
              toast: true,
              showConfirmButton: false,
              position: 'bottom-end'
            })
          )
        )
      ),
    {
      dispatch: false
    }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private planService: PlanService,
    private router: Router
  ) {}
}
