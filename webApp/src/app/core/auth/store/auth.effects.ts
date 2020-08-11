import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, ofType, createEffect, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, map, switchMap, catchError, concatMap, withLatestFrom, mergeMap } from 'rxjs/operators';
import * as authActions from './auth.actions';
import { AuthenticationService } from '../services';
import { SocketService, SocketEvent, ToastMessageService } from '@/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { Store, select, Action } from '@ngrx/store';
import { getToken } from './auth.selectors';
import { selectUrl, AppState } from '@/core/reducers';
import { changeIsEditingState } from '@/modules/users/store/user.actions';
import { initPreferences } from '@/core/reducers/preferences.actions';

@Injectable()
export class AuthEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private scktService: SocketService,
    private store$: Store<AppState>,
    private toastMessageService: ToastMessageService
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
            of(authActions.registerFailure({ apiResp: errorResponse.error }))
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
      catchError((errorResponse: HttpErrorResponse) => of(authActions.logInFailure({ apiResp: errorResponse.error })))
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
          map(apiResp => authActions.resetPasswordSuccess({ apiResp })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.resetPasswordFailure({ apiResp: errorResponse.error }))
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
          map(apiResp => authActions.resetPasswordSuccess({ apiResp })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.resetPasswordFailure({ apiResp: errorResponse.error }))
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
          map(apiResp => authActions.activateAccountSuccess({ apiResp })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(authActions.activateAccountFailure({ apiResp: errorResponse.error }))
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
          this.toastMessageService.popup(
            'You are not authorized to see this page, or your session has been expired!',
            'error',
            3000
          );
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
      switchMap(() => this.authService.getProfile()),
      switchMap(currentUser => {
        this.scktService.emit(SocketEvent.ISONLINE, {
          id: currentUser.id,
          name: currentUser.name,
          surname: currentUser.surname,
          avatar: currentUser.avatar,
          OrganizationId: currentUser.OrganizationId
        });

        currentUser = { ...currentUser, online: true };

        if (currentUser.Preference) {
          const { id, UserId, createdAt, updatedAt, ...preferences } = currentUser.Preference;
          return [
            authActions.currentUserLoaded({ currentUser }),
            ...(preferences && [initPreferences({ preferences })])
          ];
        } else {
          return [authActions.currentUserLoaded({ currentUser })];
        }
      }),
      catchError((errorResponse: HttpErrorResponse) =>
        of(authActions.currentUserLoadFailed({ apiResp: errorResponse.error }))
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logInSuccess, authActions.refreshSessionSuccess, authActions.deleteSessionSuccess),
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
        of(authActions.refreshSessionFailure({ apiResp: errorResponse.error }))
      )
    )
  );

  deleteSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.deleteSession),
      map(payload => payload.id),
      switchMap(id => this.authService.deleteSession(id)),
      map(apiResp => {
        this.toastMessageService.toast('Session is deactivated', 'success');
        return authActions.deleteSessionSuccess({ apiResp });
      }),
      catchError((errorResponse: HttpErrorResponse) =>
        of(authActions.deleteSessionFailure({ apiResp: errorResponse.error }))
      )
    )
  );

  deleteMultipleSessions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.deleteMultipleSession),
      map(payload => payload.sessionIds),
      switchMap(sessionIds => this.authService.deleteSessionMultiple(sessionIds)),
      map(apiResp => {
        this.toastMessageService.toast('Session is deactivated', 'success');
        return authActions.deleteSessionSuccess({ apiResp });
      }),
      catchError((errorResponse: HttpErrorResponse) =>
        of(authActions.deleteSessionFailure({ apiResp: errorResponse.error }))
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

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateUserProfileRequested),
      map(payload => payload.user),
      switchMap(user => this.authService.updateProfile(user)),
      switchMap(currentUser => {
        this.toastMessageService.toast('Your profile is updated!', 'success');
        return [authActions.updateUserProfileSuccess({ currentUser }), changeIsEditingState({ isEditing: false })];
      }),
      catchError((errorResponse: HttpErrorResponse) =>
        of(authActions.updateUserOrgFailure({ apiResp: errorResponse.error }))
      )
    )
  );

  updateUserOrg$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateUserOrgRequested),
      map(payload => payload.organization),
      switchMap(organization => this.authService.updateOrg(organization)),
      switchMap(organization => {
        this.toastMessageService.toast('Organization is updated!', 'success');
        return [authActions.updateUserOrgSuccess({ organization }), changeIsEditingState({ isEditing: false })];
      }),
      catchError((errorResponse: HttpErrorResponse) =>
        of(authActions.updateUserOrgFailure({ apiResp: errorResponse.error }))
      )
    )
  );

  ngrxOnInitEffects(): Action {
    return authActions.refreshSession();
  }
}
