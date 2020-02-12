import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as stateActions from './state.actions';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { StateService } from '../_services';
import { AppState } from '@/core/reducers';
import { allStatesLoaded } from './state.selectors';

@Injectable()
export class StateEffects {
  loadAllStates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stateActions.allStatesRequested),
      withLatestFrom(this.store.pipe(select(allStatesLoaded))),
      filter(([action, allStatesLoaded]) => !allStatesLoaded),
      mergeMap(() => this.stateService.getList()),
      map(list => stateActions.allStatesLoaded({ list })),
      catchError(err => {
        return throwError(err);
      })
    )
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private stateService: StateService) {}
}
