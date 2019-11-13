import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as planActions from './plan.actions';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { PlanService, StageService } from '../_services';
import { AppState } from '@/core/reducers';
import { PlanServerResponse, Stage, Plan } from '../_models';
import { allStagesLoaded } from './plan.selectors';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class PlanEffects {
  @Effect()
  createPlan$: Observable<Action> = this.actions$.pipe(
    ofType<planActions.CreatePlan>(planActions.PlanActionTypes.PLAN_CREATE),
    map((action: planActions.CreatePlan) => action.payload.plan),
    mergeMap((plan: Plan) =>
      this.planService.create({ ...plan }).pipe(
        map(newPlan => {
          Swal.fire({
            title: 'Plan created!',
            type: 'success',
            timer: 1500
          });
          this.router.navigate(['/planner']);
          return new planActions.CreatePlanSuccess({ plan: newPlan });
        }),
        catchError(err => {
          Swal.fire({
            title: 'Ooops, something went wrong!',
            type: 'error',
            timer: 1500
          });
          return of(new planActions.CreatePlanFail(err));
        })
      )
    )
  );

  @Effect()
  loadPlan$: Observable<Action> = this.actions$.pipe(
    ofType<planActions.PlanRequested>(planActions.PlanActionTypes.PLAN_REQUESTED),
    mergeMap(action => this.planService.getOne(action.payload.planId)),
    map(plan => new planActions.PlanLoaded({ plan }))
  );

  @Effect()
  loadPlans$ = this.actions$.pipe(
    ofType<planActions.ListPageRequested>(planActions.PlanActionTypes.PLAN_LIST_PAGE_REQUESTED),
    mergeMap(({ payload }) =>
      this.planService
        .getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
        .pipe(
          catchError(err => {
            this.store.dispatch(new planActions.ListPageCancelled());
            return of(new PlanServerResponse());
          })
        )
    ),
    map((response: PlanServerResponse) => new planActions.ListPageLoaded(response))
  );

  @Effect({ dispatch: false })
  deletePlan$ = this.actions$.pipe(
    ofType<planActions.DeletePlan>(planActions.PlanActionTypes.DELETE_PLAN),
    mergeMap(action => this.planService.delete(action.payload.planId)),
    map(() => {
      Swal.fire({
        text: `Plan deleted`,
        type: 'success',
        timer: 6000,
        toast: true,
        showConfirmButton: false,
        position: 'bottom-end'
      });
    })
  );

  @Effect()
  loadAllStage$ = this.actions$.pipe(
    ofType<planActions.AllStagesRequestedFromDashboard | planActions.AllStagesRequestedFromDialogWindow>(
      planActions.PlanActionTypes.ALLSTAGES_REQUESTED_FROM_DASHBOARD,
      planActions.PlanActionTypes.ALLSTAGES_REQUESTED_FROM_DIALOGWINDOW
    ),
    withLatestFrom(this.store.pipe(select(allStagesLoaded))),
    filter(([action, allStagesLoaded]) => !allStagesLoaded),
    mergeMap(() => this.stageService.getList()),
    map(stages => new planActions.AllStagesLoaded(stages)),
    catchError(err => throwError(err))
  );

  @Effect()
  createStage$: Observable<Action> = this.actions$.pipe(
    ofType<planActions.CreateStage>(planActions.PlanActionTypes.STAGE_CREATE),
    map((action: planActions.CreateStage) => action.payload.stage),
    mergeMap((stage: Stage) =>
      this.stageService.create(stage).pipe(
        map(newStage => {
          Swal.fire({
            title: 'Stage created!',
            type: 'success',
            timer: 1500
          });
          return new planActions.CreateStageSuccess({
            stage: newStage
          });
        }),
        catchError(err => {
          Swal.fire({
            title: 'Ooops, something went wrong!',
            type: 'error',
            timer: 1500
          });
          return of(new planActions.CreateStageFail(err));
        })
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private planService: PlanService,
    private stageService: StageService,
    private router: Router
  ) {}
}
