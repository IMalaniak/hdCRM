import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as planActions from './plan.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PlanService } from '../services';
import { Plan } from '../models';
import { Router } from '@angular/router';
import { ToastMessageService, CollectionApiResponse, ItemApiResponse, ApiResponse } from '@/shared';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PlanEffects {
  createPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.createPlan),
      map(payload => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create(plan).pipe(
          map((response: ItemApiResponse<Plan>) => {
            this.toastMessageService.snack(response);
            this.router.navigate(['/planner']);
            return planActions.createPlanSuccess({ plan: response.data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(planActions.planApiError());
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
      map((response: ItemApiResponse<Plan>) => planActions.planLoaded({ plan: response.data })),
      catchError(() => of(planActions.planApiError()))
    )
  );

  loadPlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.listPageRequested),
      map(payload => payload.page),
      mergeMap(page =>
        this.planService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: CollectionApiResponse<Plan>) => planActions.listPageLoaded({ response })),
          catchError(() => of(planActions.planApiError()))
        )
      )
    )
  );

  // TODO @IMalaniak recreate this
  deletePlan$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(planActions.deletePlan),
        map(payload => payload.id),
        mergeMap(id => this.planService.delete(id)),
        map((response: ApiResponse) => of(this.toastMessageService.snack(response))),
        catchError(() => of(planActions.planApiError()))
      ),
    {
      dispatch: false
    }
  );

  constructor(
    private actions$: Actions,
    private planService: PlanService,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}
}
