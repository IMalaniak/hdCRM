import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as privilegeActions from './privilege.actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap } from 'rxjs/operators';
import { PrivilegeService } from '../services';
import { AppState } from '@/core/reducers';
import { Privilege } from '../models';
import { allPrivilegesLoaded } from './privilege.selectors';
import { ToastMessageService, CollectionApiResponse, ItemApiResponse } from '@/shared';
import { HttpErrorResponse } from '@angular/common/http';

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
      mergeMap(() => this.privilegeService.getFullList()),
      map((response: CollectionApiResponse<Privilege>) => privilegeActions.allPrivilegesLoaded({ response })),
      catchError(() => of(privilegeActions.privilegeApiError()))
    )
  );

  createPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(privilegeActions.createPrivilegeRequested),
      map((payload) => payload.privilege),
      mergeMap((privilege: Privilege) =>
        this.privilegeService.create(privilege).pipe(
          map((response: ItemApiResponse<Privilege>) => {
            this.toastMessageService.snack(response);
            return privilegeActions.createPrivilegeSuccess({
              privilege: response.data
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(privilegeActions.privilegeApiError());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private privilegeService: PrivilegeService,
    private toastMessageService: ToastMessageService
  ) {}
}
