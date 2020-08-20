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

@Injectable()
export class StageEffects {
  loadAllStage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stageActions.allStagesRequestedFromDashboard, stageActions.allStagesRequestedFromDialogWindow),
      withLatestFrom(this.store.pipe(select(allStagesLoaded))),
      filter(([_, allStagesLoaded]) => !allStagesLoaded),
      mergeMap(() => this.stageService.getList()),
      map(response => stageActions.allStagesLoaded({ response })),
      catchError(() => of(stageActions.stageApiError()))
    )
  );

  createStage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stageActions.createStage),
      map(payload => payload.stage),
      mergeMap((stage: Stage) =>
        this.stageService.create(stage).pipe(
          map(response => {
            this.toastMessageService.toast('Stage created!');
            return stageActions.createStageSuccess({
              stage: response.data
            });
          }),
          catchError(() => of(stageActions.stageApiError()))
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
