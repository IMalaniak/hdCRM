import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';

import { AppState } from '@core/store';
import { CollectionApiResponse, ItemApiResponse } from '@shared/models';
import { ToastMessageService } from '@shared/services';

import { StageService } from '../../services';
import { Stage } from '../../shared/models';

import * as stageActions from './stage.actions';
import { allStagesLoaded } from './stage.selectors';

@Injectable()
export class StageEffects {
  loadAllStage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stageActions.allStagesRequestedFromDashboard, stageActions.allStagesRequestedFromDialogWindow),
      withLatestFrom(this.store.pipe(select(allStagesLoaded))),
      filter(([_, allStagesLoaded]) => !allStagesLoaded),
      mergeMap(() => this.stageService.getDashboardData()),
      map((response: CollectionApiResponse<Stage>) => {
        if (response.data) {
          // TODO: @IMalaniak: handle 204 responce correctly
          return stageActions.allStagesApiLoaded({ response });
        }
      }),
      catchError(() => of(stageActions.stageApiError()))
    )
  );

  createStage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stageActions.createStage),
      map((payload) => payload.stage),
      mergeMap((stage: Stage) =>
        this.stageService.create<Stage>(stage).pipe(
          map((response: ItemApiResponse<Stage>) => {
            this.toastMessageService.success(response.message);
            return stageActions.createStageSuccess({
              stage: response.data
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
            return of(stageActions.stageApiError());
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<AppState>,
    private readonly stageService: StageService,
    private readonly toastMessageService: ToastMessageService
  ) {}
}
