import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom, filter, tap } from 'rxjs/operators';

import { AppState } from '@core/store';
import { CollectionApiResponse, ItemApiResponse } from '@shared/models';
import { ToastMessageService } from '@shared/services';

import { PrivilegeService } from '../../services';
import { Privilege } from '../../shared/models';

import * as privilegeActions from './privilege.actions';
import { allPrivilegesLoaded } from './privilege.selectors';

@Injectable()
export class PrivilegeEffects {
  loadAllPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(privilegeActions.allPrivilegesRequested),
      withLatestFrom(this.store.pipe(select(allPrivilegesLoaded))),
      tap(([_, allPrivilegesLoaded]) => {
        if (allPrivilegesLoaded) {
          this.store.dispatch(privilegeActions.allPrivilegesRequestCanceled());
        }
      }),
      filter(([_, allPrivilegesLoaded]) => !allPrivilegesLoaded),
      mergeMap(() => this.privilegeService.getList<Privilege>()),
      map((response: CollectionApiResponse<Privilege>) => privilegeActions.allPrivilegesApiLoaded({ response })),
      catchError(() => of(privilegeActions.privilegeApiError()))
    )
  );

  createPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(privilegeActions.createPrivilegeRequested),
      map((payload) => payload.privilege),
      mergeMap((privilege: Privilege) =>
        this.privilegeService.create<Privilege>(privilege).pipe(
          map((response: ItemApiResponse<Privilege>) => {
            this.toastMessageService.success(response.message);
            return privilegeActions.createPrivilegeSuccess({
              privilege: response.data
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
            return of(privilegeActions.privilegeApiError());
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<AppState>,
    private readonly privilegeService: PrivilegeService,
    private readonly toastMessageService: ToastMessageService
  ) {}
}
