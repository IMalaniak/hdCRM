import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, filter, first } from 'rxjs/operators';

import { AppState } from '@core/store';
import { formRequested, selectFormByName } from '@core/store/dynamic-form';
import { RoutingDataConstants } from '@shared/constants';
import { DynamicForm } from '@shared/models';

@Injectable()
export class DynamicFormResolver implements Resolve<DynamicForm> {
  constructor(private store$: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<DynamicForm> {
    const formName: string = route.data[RoutingDataConstants.FORM_NAME];

    return this.store$.pipe(
      select(selectFormByName(formName)),
      tap((form) => {
        if (!form) {
          this.store$.dispatch(formRequested({ formName }));
        }
      }),
      filter((form) => !!form),
      first()
    );
  }
}
