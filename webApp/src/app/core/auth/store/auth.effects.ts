import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, ofType, createEffect, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, map, switchMap, catchError, concatMap, withLatestFrom, mergeMap } from 'rxjs/operators';

import * as authActions from './auth.actions';

import { AuthenticationService } from '../services';
import Swal from 'sweetalert2';

import { SocketService, SocketEvent } from '@/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { Store, select, Action } from '@ngrx/store';
import { getToken } from './auth.selectors';
import { selectUrl, AppState } from '@/core/reducers';

@Injectable()
export class AuthEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private scktService: SocketService,
    private store$: Store<AppState>
  ) {}

  registerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.registerUser),
      map(payload => payload.user),
      switchMap(registerData =>
        this.authService.registerUser(registerData).pipe(
          map(user => authActions.registerSuccess(user)),
          tap(() => this.router.navigateByUrl('/auth/register-success')),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.registerFailure({ response: errorResponse.error }))
          )
        )
      )
    )
  );

  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logIn),
      map(payload => payload.user),
      switchMap(userLoginData => this.authService.login(userLoginData)),
      switchMap(accessToken => {
        const sessionId = this.authService.getTokenDecoded(accessToken).sessionId;
        return [authActions.logInSuccess({ accessToken }), authActions.setSessionId({ sessionId })];
      }),
      tap(() => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      }),
      catchError((errorResponse: HttpErrorResponse) => of(authActions.logInFailure({ response: errorResponse.error })))
    )
  );

  logOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logOut),
        tap(() =>
          this.authService.logout().subscribe(() => {
            this.scktService.emit(SocketEvent.ISOFFLINE);
            this.router.navigateByUrl('/home');
          })
        )
      ),
    {
      dispatch: false
    }
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.resetPasswordRequest),
      map(payload => payload.user),
      switchMap(user =>
        this.authService.requestPasswordReset(user).pipe(
          map(response => authActions.resetPasswordSuccess({ response })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.resetPasswordFailure({ response: errorResponse.error }))
          )
        )
      )
    )
  );

  setNewPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.setNewPassword),
      map(payload => payload.newPassword),
      switchMap(newPassword =>
        this.authService.resetPassword(newPassword).pipe(
          map(response => authActions.resetPasswordSuccess({ response })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.resetPasswordFailure({ response: errorResponse.error }))
          )
        )
      )
    )
  );

  activateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.activateAccount),
      map(payload => payload.token),
      concatMap(token =>
        this.authService.activateAccount(token).pipe(
          map(response => authActions.activateAccountSuccess({ response })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.activateAccountFailure({ response: errorResponse.error }))
          )
        )
      )
    )
  );

  redirectToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.redirectToLogin),
        withLatestFrom(this.store$.pipe(select(selectUrl))),
        map(([action, returnUrl]) => {
          Swal.fire({
            text: 'You are not authorized to see this page, or your session has been expired!',
            icon: 'error',
            timer: 3000
          });
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl }
          });
        })
      ),
    {
      dispatch: false
    }
  );

  requestCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.requestCurrentUser),
      switchMap(() =>
        this.authService.getProfile().pipe(
          map(currentUser => {
            this.scktService.emit(SocketEvent.ISONLINE, {
              id: currentUser.id,
              name: currentUser.name,
              surname: currentUser.surname,
              avatar: currentUser.avatar,
              OrganizationId: currentUser.OrganizationId
            });

            return authActions.currentUserLoaded({ currentUser });
          }),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.currentUserLoadFailed({ response: errorResponse.error }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logInSuccess, authActions.refreshSessionSuccess),
      switchMap(() => of(authActions.requestCurrentUser()))
    )
  );

  refreshSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshSession),
      switchMap(() => this.authService.refreshSession()),
      switchMap(accessToken => {
        const sessionId = this.authService.getTokenDecoded(accessToken).sessionId;
        return [authActions.refreshSessionSuccess({ accessToken }), authActions.setSessionId({ sessionId })];
      }),
      catchError((errorResponse: HttpErrorResponse) =>
        of(authActions.refreshSessionFailure({ response: errorResponse.error }))
      )
    )
  );

  checkIsTokenValid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.checkIsTokenValid),
      withLatestFrom(this.store$.pipe(select(getToken))),
      switchMap(([action, token]) => {
        const isValid = this.authService.isTokenValid(token);
        if (isValid) {
          return of(authActions.checkIsTokenValidSuccess());
        } else {
          return of(authActions.checkIsTokenValidFailure());
        }
      })
    )
  );

  checkIsTokenValidFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.checkIsTokenValidFailure),
      mergeMap(() => of(authActions.refreshSession()))
    )
  );

  ngrxOnInitEffects(): Action {
    return authActions.refreshSession();
  }
}
