import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as stateActions from './state.actions';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { StateService } from '../_services';
import { AppState } from '@/core/reducers';
import { allStatesLoaded } from './state.selectors';

@Injectable()
export class StateEffects {

  @Effect()
  loadAllStates$ = this.actions$.pipe(
    ofType<stateActions.AllStatesRequested>(stateActions.StateActionTypes.ALLSTATES_REQUESTED),
    withLatestFrom(this.store.pipe(select(allStatesLoaded))),
    filter(([action, allStatesLoaded]) => !allStatesLoaded),
    mergeMap(() => this.stateService.getList()),
    map(states => new stateActions.AllStatesLoaded({ states })),
    catchError(err => {
      console.log('error loading all states ', err);
      return throwError(err);
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private stateService: StateService
  ) {}
}
