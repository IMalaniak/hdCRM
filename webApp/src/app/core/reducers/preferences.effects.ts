import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as preferencesActions from './preferences.actions';
import { withLatestFrom, exhaustMap, filter, map, mergeMap, catchError } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { PreferencesService } from '../services/preferences.service';
import { getPreferencesState, getListLoaded } from './preferences.selectors';
import { AppState } from '.';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PreferencesEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private preferencesService: PreferencesService
  ) {}

  loadPreferencesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(preferencesActions.preferencesListRequested),
      withLatestFrom(this.store$.pipe(select(getListLoaded))),
      filter(([action, listLoaded]) => !listLoaded),
      mergeMap(() => this.preferencesService.getList()),
      map((list) => preferencesActions.preferencesListLoaded({ list })),
      catchError((errorResponse: HttpErrorResponse) =>
        of(preferencesActions.preferencesListLoadFailed({ apiResp: errorResponse.error }))
      )
    )
  );

  changePreferences$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          preferencesActions.changeDateFormat,
          preferencesActions.changeItemsPerPage,
          preferencesActions.changeListView,
          preferencesActions.changeTimeFormat
        ),
        withLatestFrom(this.store$.pipe(select(getPreferencesState))),
        exhaustMap(([_, preferences]) => {
          return this.preferencesService.set(preferences);
        })
      ),
    { dispatch: false }
  );
}
