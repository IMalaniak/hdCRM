import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { DynamicFormService } from '@/core/services/dynamic-form.service';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as dynamicFormActions from './dynamic-form.actions';
import { of } from 'rxjs';
import { ItemApiResponse, DymanicForm } from '@/shared';

@Injectable()
export class DynamicFormEffects {
  loadFrom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dynamicFormActions.formRequested),
      map(payload => payload.formName),
      mergeMap(formName => this.dynamicFormService.getOne(formName)),
      map((response: ItemApiResponse<DymanicForm>) => dynamicFormActions.formLoaded({ form: response.data })),
      catchError(() => of(dynamicFormActions.formsApiError()))
    )
  );

  constructor(private actions$: Actions, private dynamicFormService: DynamicFormService) {}
}
