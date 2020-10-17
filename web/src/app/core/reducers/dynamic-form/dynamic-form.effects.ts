import { Injectable } from '@angular/core';

import { Actions, ofType, createEffect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, filter } from 'rxjs/operators';

import { DynamicFormService } from '@/core/services/dynamic-form.service';
import { ItemServiceMessage, DynamicForm } from '@/shared/models';
import * as dynamicFormActions from './dynamic-form.actions';
import { selectFormIds } from './dynamic-form.selectors';
import { AppState } from '..';

@Injectable()
export class DynamicFormEffects {
  loadForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dynamicFormActions.formRequested),
      map((payload) => payload.formName),
      withLatestFrom(this.store$.pipe(select(selectFormIds))),
      filter(([formName, formNames]) => formNames && !formNames.some((el) => el === formName)),
      // this filters already loaded
      mergeMap(([formName]) => this.dynamicFormService.getOne(formName)),
      map((response: ItemServiceMessage<DynamicForm>) => dynamicFormActions.formLoaded({ form: response.data })),
      catchError(() => of(dynamicFormActions.formsApiError()))
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private dynamicFormService: DynamicFormService
  ) {}
}
