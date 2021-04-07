import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { AppState } from '@/core/store';
import { ToastMessageService } from '@/shared/services';
import { CollectionApiResponse, ItemApiResponse } from '@/shared/models';
import * as stageActions from './stage.actions';
import { StageService } from '../../services';
import { Stage } from '../../shared/models';
import { allStagesLoaded } from './stage.selectors';

@Injectable()
export class StageEffects {
  loadAllStage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stageActions.allStagesRequestedFromDashboard, stageActions.allStagesRequestedFromDialogWindow),
      withLatestFrom(this.store.pipe(select(allStagesLoaded))),
      filter(([_, allStagesLoaded]) => !allStagesLoaded),
      mergeMap(() => this.stageService.getList<Stage>()),
      map((response: CollectionApiResponse<Stage>) => stageActions.allStagesApiLoaded({ response })),
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
