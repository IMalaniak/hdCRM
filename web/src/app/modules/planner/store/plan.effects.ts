import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { ToastMessageService } from '@/shared/services';
import { RoutingConstants } from '@/shared/constants';
import { Page } from '@/shared/store';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as planActions from './plan.actions';
import { PlanService } from '../services';
import { Plan } from '../models';
import { CollectionApiResponse, ItemApiResponse, ApiResponse } from '@/shared/models';

@Injectable()
export class PlanEffects {
  createPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.createPlanRequested),
      map((payload) => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create(plan).pipe(
          map((response: ItemApiResponse<Plan>) => {
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
      map((response: ItemApiResponse<Plan>) => planActions.planLoaded({ plan: response.data })),
      catchError(() => of(planActions.planApiError()))
    )
  );

  loadPlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((pageQuery) =>
        this.planService.getList(pageQuery).pipe(
          map((response: CollectionApiResponse<Plan>) => {
            const page: Page = { dataIds: response.ids, key: generatePageKey(pageQuery) };
            return planActions.listPageLoaded({ response, page });
          }),
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
          map((response: ItemApiResponse<Plan>) => {
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
          map((response: ApiResponse) => {
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
