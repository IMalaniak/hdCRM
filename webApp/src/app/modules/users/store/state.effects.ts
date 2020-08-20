import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as stateActions from './state.actions';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { StateService } from '../services';
import { AppState } from '@/core/reducers';
import { allStatesLoaded } from './state.selectors';
import { of } from 'rxjs';

@Injectable()
export class StateEffects {
  loadAllStates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stateActions.allStatesRequested),
      withLatestFrom(this.store.pipe(select(allStatesLoaded))),
      filter(([_, allStatesLoaded]) => !allStatesLoaded),
      mergeMap(() => this.stateService.getList().pipe()),
      map(response => stateActions.allStatesLoaded({ list: response.data })),
      catchError(() => of(stateActions.statesApiError()))
    )
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private stateService: StateService) {}
}
