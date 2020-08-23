import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as stageActions from './stage.actions';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { StageService } from '../services';
import { AppState } from '@/core/reducers';
import { Stage } from '../models';
import { allStagesLoaded } from './stage.selectors';
import { ToastMessageService } from '@/shared/services';
import { HttpErrorResponse } from '@angular/common/http';
import { CollectionApiResponse, ItemApiResponse } from '@/shared';

@Injectable()
export class StageEffects {
  loadAllStage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stageActions.allStagesRequestedFromDashboard, stageActions.allStagesRequestedFromDialogWindow),
      withLatestFrom(this.store.pipe(select(allStagesLoaded))),
      filter(([_, allStagesLoaded]) => !allStagesLoaded),
      mergeMap(() => this.stageService.getList()),
      map((response: CollectionApiResponse<Stage>) => stageActions.allStagesLoaded({ response })),
      catchError(() => of(stageActions.stageApiError()))
    )
  );

  createStage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stageActions.createStage),
      map(payload => payload.stage),
      mergeMap((stage: Stage) =>
        this.stageService.create(stage).pipe(
          map((response: ItemApiResponse<Stage>) => {
            this.toastMessageService.snack(response);
            return stageActions.createStageSuccess({
              stage: response.data
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(stageActions.stageApiError());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private stageService: StageService,
    private toastMessageService: ToastMessageService
  ) {}
}
