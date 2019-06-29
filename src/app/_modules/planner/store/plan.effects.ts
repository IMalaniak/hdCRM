import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PlanRequested, PlanActionTypes, PlanLoaded, ListPageRequested, ListPageLoaded, ListPageCancelled, AllStagesRequestedFromDashboard, AllStagesLoaded, CreateStage, CreateStageSuccess, CreateStageFail, AllStagesRequestedFromDialogWindow, CreatePlan, CreatePlanSuccess, CreatePlanFail } from './plan.actions';
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
      ofType<CreatePlan>(PlanActionTypes.CreatePlan),
      map((action: CreatePlan) => action.payload.plan),
      mergeMap((plan: Plan) =>
        this.planService.create({...plan}).pipe(
          map(newPlan => {
            Swal.fire({
              title: 'Plan created!',
              type: 'success',
              timer: 1500
            });
            this.router.navigate(['/planner']);
            return new CreatePlanSuccess({plan: newPlan});
          }),
          catchError(err => {
            Swal.fire({
              title: 'Ooops, something went wrong!',
              type: 'error',
              timer: 1500
            });
            return of(new CreatePlanFail(err));
          })
        )
      )
    );

    @Effect()
    loadPlan$: Observable<Action> = this.actions$.pipe(
        ofType<PlanRequested>(PlanActionTypes.PlanRequested),
        mergeMap(action => this.planService.getOne(action.payload.planId)),
        map(plan => new PlanLoaded({plan}))
    );

    @Effect()
    loadPlans$ = this.actions$.pipe(
        ofType<ListPageRequested>(PlanActionTypes.ListPageRequested),
        mergeMap(({payload}) =>
                this.planService.getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
                  .pipe(
                    catchError(err => {
                      this.store.dispatch(new ListPageCancelled());
                      return of(new PlanServerResponse());
                    })
                  )
        ),
        map((response: PlanServerResponse) => new ListPageLoaded(response)),
    );

    @Effect()
    loadAllStage$ = this.actions$.pipe(
        ofType<AllStagesRequestedFromDashboard | AllStagesRequestedFromDialogWindow>(PlanActionTypes.AllStagesRequestedFromDashboard, PlanActionTypes.AllStagesRequestedFromDialogWindow),
        withLatestFrom(this.store.pipe(select(allStagesLoaded))),
        filter(([action, allStagesLoaded]) => !allStagesLoaded),
        mergeMap(() => this.stageService.getList()),
        map(stages => new AllStagesLoaded(stages)),
        catchError(err => throwError(err))
    );

    @Effect()
    createStage$: Observable<Action> = this.actions$.pipe(
      ofType<CreateStage>(PlanActionTypes.CreateStage),
      map((action: CreateStage) => action.payload.stage),
      mergeMap((stage: Stage) =>
        this.stageService.create(stage).pipe(
          map(newStage => {
            Swal.fire({
              title: 'Stage created!',
              type: 'success',
              timer: 1500
            });
            return new CreateStageSuccess({stage: newStage});
          }),
          catchError(err => {
            Swal.fire({
              title: 'Ooops, something went wrong!',
              type: 'error',
              timer: 1500
            });
            return of(new CreateStageFail(err));
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
