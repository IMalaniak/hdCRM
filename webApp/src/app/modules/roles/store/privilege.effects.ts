import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import * as privilegeActions from './privilege.actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap } from 'rxjs/operators';
import { PrivilegeService } from '../services';
import { AppState } from '@/core/reducers';
import { Privilege } from '../models';
import { allPrivilegesLoaded } from './privilege.selectors';
import { ToastMessageService } from '@/shared';

@Injectable()
export class PrivilegeEffects {
  @Effect()
  loadAllPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(privilegeActions.allPrivilegesRequested),
      withLatestFrom(this.store.pipe(select(allPrivilegesLoaded))),
      tap(([action, allPrivilegesLoaded]) => {
        if (allPrivilegesLoaded) {
          this.store.dispatch(privilegeActions.allPrivilegesRequestCanceled());
        }
      }),
      filter(([action, allPrivilegesLoaded]) => !allPrivilegesLoaded),
      mergeMap(() => this.privilegeService.getFullList()),
      map(response => privilegeActions.allPrivilegesLoaded({ response })),
      catchError(err => throwError(err))
    )
  );

  @Effect()
  createPrivilege$ = createEffect(() =>
    this.actions$.pipe(
      ofType(privilegeActions.createPrivilege),
      map(payload => payload.privilege),
      mergeMap((privilege: Privilege) =>
        this.privilegeService.create(privilege).pipe(
          map(newPrivilege => {
            this.toastMessageService.popup('Privilege created!', 'success', 1500);
            return privilegeActions.createPrivilegeSuccess({
              privilege: newPrivilege
            });
          }),
          catchError(error => {
            this.toastMessageService.popup('Ooops, something went wrong!', 'error', 1500);
            return of(privilegeActions.createPrivilegeFail({ error }));
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
