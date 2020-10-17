import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as planActions from './plan.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PlanService } from '../services';
import { Plan } from '../models';
import { Router } from '@angular/router';
import { ToastMessageService } from '@/shared/services';
import { CollectionServiceMessage, ItemServiceMessage, ServiceMessage } from '@/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { RoutingConstants } from '@/shared/constants';

@Injectable()
export class PlanEffects {
  createPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.createPlanRequested),
      map((payload) => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create(plan).pipe(
          map((response: ItemServiceMessage<Plan>) => {
            this.toastMessageService.snack(response);
            this.router.navigateByUrl(RoutingConstants.ROUTE_PLANNER);
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
      map((payload) => payload.id),
      mergeMap((id) => this.planService.getOne(id)),
      map((response: ItemServiceMessage<Plan>) => planActions.planLoaded({ plan: response.data })),
      catchError(() => of(planActions.planApiError()))
    )
  );

  loadPlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((page) =>
        this.planService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: CollectionServiceMessage<Plan>) => planActions.listPageLoaded({ response })),
          catchError(() => of(planActions.planApiError()))
        )
      )
    )
  );

  updatePlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.updatePlanRequested),
      map((payload) => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.updateOne(plan).pipe(
          map((response: ItemServiceMessage<Plan>) => {
            const plan: Update<Plan> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.snack(response);
            return planActions.updatePlanSuccess({ plan });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(planActions.planApiError());
          })
        )
      )
    )
  );

  deletePlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.deletePlanRequested),
      map((payload) => payload.id),
      mergeMap((id: number) =>
        this.planService.delete(id).pipe(
          map((response: ServiceMessage) => {
            this.toastMessageService.snack(response);
            return planActions.deletePlanSuccess({ id });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(planActions.planApiError());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private planService: PlanService,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}
}
