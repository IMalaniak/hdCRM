import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { withLatestFrom, exhaustMap, filter, map, mergeMap, catchError } from 'rxjs/operators';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import { PreferencesService } from '../../services/preferences.service';
import { AppState } from '../index';

import * as preferencesActions from './preferences.actions';
import { getPreferencesState, getListLoaded } from './preferences.selectors';


@Injectable()
export class PreferencesEffects {
  loadPreferencesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(preferencesActions.preferencesListRequested),
      withLatestFrom(this.store$.pipe(select(getListLoaded))),
      filter(([_, listLoaded]) => !listLoaded),
      mergeMap(() => this.preferencesService.getList()),
      map((response) => preferencesActions.preferencesListLoaded({ list: response.data })),
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
          preferencesActions.changeTimeFormat,
          preferencesActions.changeListBordersVisibility
        ),
        withLatestFrom(this.store$.pipe(select(getPreferencesState))),
        exhaustMap(([_, preferencesState]) => {
          const { list, listLoaded, ...preferences } = preferencesState;
          return this.preferencesService.set(preferences);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private preferencesService: PreferencesService
  ) {}
}
