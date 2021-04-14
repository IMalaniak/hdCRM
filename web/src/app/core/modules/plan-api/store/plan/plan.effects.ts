import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';

import { normalizeResponse, planSchema, partialDataLoaded, planListSchema } from '@core/store/normalization';
import { RoutingConstants } from '@shared/constants';
import { CollectionApiResponse, ItemApiResponse, BaseMessage } from '@shared/models';
import { ToastMessageService } from '@shared/services';
import { Page } from '@shared/store';
import { generatePageKey } from '@shared/utils/generatePageKey';

import { PlanService } from '../../services';
import { Plan } from '../../shared/models';

import * as planActions from './plan.actions';

@Injectable()
export class PlanEffects {
  createPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(planActions.createPlanRequested),
      map((payload) => payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create<Plan>(this.planService.formatBeforeSend(plan)).pipe(
          switchMap((response: ItemApiResponse<Plan>) => {
            this.toastMessageService.success(response.message);
            this.router.navigateByUrl(RoutingConstants.ROUTE_PLANNER);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { Plans, Users } = normalizeResponse<Plan>(response, planSchema);
            response = { ...response, data: Plans[0] };
            return [
              planActions.createPlanSuccess({ plan: response.data }),
              ...(Users ? [partialDataLoaded({ Users })] : [])
            ];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { Plans, Users } = normalizeResponse<Plan>(response, planSchema);
        response = { ...response, data: Plans[0] };
        return [planActions.planLoaded({ plan: response.data }), ...(Users ? [partialDataLoaded({ Users })] : [])];
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { Plans, Users } = normalizeResponse<Plan>(response, planListSchema);
            if (!Plans) {
              return EMPTY;
            }
            response = { ...response, data: Plans };
            return [planActions.listPageLoaded({ response, page }), ...(Users ? [partialDataLoaded({ Users })] : [])];
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { Plans, Users } = normalizeResponse<Plan>(response, planSchema);
            response = { ...response, data: Plans[0] };
            const plan: Update<Plan> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.success(response.message);
            return [planActions.updatePlanSuccess({ plan }), ...(Users ? [partialDataLoaded({ Users })] : [])];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
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
            this.toastMessageService.success(response.message);
            return planActions.deletePlanSuccess({ id });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
            return of(planActions.planApiError());
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly planService: PlanService,
    private readonly router: Router,
    private readonly toastMessageService: ToastMessageService
  ) {}
}
