import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { ToastMessageService } from '@/shared/services';
import { RoutingConstants } from '@/shared/constants';
import { normalizeResponse, Page, partialDataLoaded, planListSchema, planSchema } from '@/shared/store';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as planActions from './plan.actions';
import { PlanService } from '../services';
import { Plan } from '../models';
import { CollectionApiResponse, ItemApiResponse, BaseMessage } from '@/shared/models';

@Injectable()
export class PlanEffects {
  createPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.createPlanRequested),
      map((payload) => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create<Plan>(this.planService.formatBeforeSend(plan)).pipe(
          switchMap((response: ItemApiResponse<Plan>) => {
            this.toastMessageService.snack(response);
            this.router.navigateByUrl(RoutingConstants.ROUTE_PLANNER);
            const { Plans, Users } = normalizeResponse<Plan>(response, planSchema);
            response = { ...response, data: Plans[0] };
            return [planActions.createPlanSuccess({ plan: response.data }), partialDataLoaded({ Users })];
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
      mergeMap((id) => this.planService.getOne<Plan>(id)),
      switchMap((response: ItemApiResponse<Plan>) => {
        const { Plans, Users } = normalizeResponse<Plan>(response, planSchema);
        response = { ...response, data: Plans[0] };
        return [planActions.planLoaded({ plan: response.data }), partialDataLoaded({ Users })];
      }),
      catchError(() => of(planActions.planApiError()))
    )
  );

  loadPlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((pageQuery) =>
        this.planService.getList<Plan>(pageQuery).pipe(
          switchMap((response: CollectionApiResponse<Plan>) => {
            const page: Page = { dataIds: response.ids, key: generatePageKey(pageQuery) };
            const { Plans, Users } = normalizeResponse<Plan>(response, planListSchema);
            response = { ...response, data: Plans };
            return [planActions.listPageLoaded({ response, page }), partialDataLoaded({ Users })];
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
        this.planService.update<Plan>(this.planService.formatBeforeSend(plan), plan.id).pipe(
          switchMap((response: ItemApiResponse<Plan>) => {
            const { Plans, Users } = normalizeResponse<Plan>(response, planSchema);
            response = { ...response, data: Plans[0] };
            const plan: Update<Plan> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.snack(response);
            return [planActions.updatePlanSuccess({ plan }), partialDataLoaded({ Users })];
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
          map((response: BaseMessage) => {
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
