import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, ofType, createEffect, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { tap, map, switchMap, catchError, concatMap, withLatestFrom, mergeMap, exhaustMap } from 'rxjs/operators';
import * as authActions from './auth.actions';
import { AuthenticationService } from '../services';
import { SocketService, ToastMessageService } from '@/shared/services';
import { BaseMessage, ItemApiResponse } from '@/shared/models';
import { SocketEvent, RoutingConstants, CONSTANTS } from '@/shared/constants';
import { Store, select, Action } from '@ngrx/store';
import { getToken } from './auth.selectors';
import { selectUrl, AppState } from '@/core/reducers';
import { changeIsEditingState } from '@/modules/users/store/user.actions';
import { initPreferences } from '@/core/reducers/preferences.actions';
import { User, Organization } from '@/modules/users';

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
      map((payload) => payload.user),
      switchMap((registerData) =>
        this.authService.registerUser(registerData).pipe(
          map(() => authActions.registerSuccess()),
          tap(() => this.router.navigateByUrl(RoutingConstants.ROUTE_AUTH_REGISTER_SUCCESS)),
          catchError(() => of(authActions.authApiError()))
        )
      )
    )
  );

  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logIn),
      map((payload) => payload.user),
      exhaustMap((userLoginData) =>
        this.authService.login(userLoginData).pipe(
          switchMap((accessToken: string) => {
            const sessionId = this.authService.getTokenDecoded(accessToken).sessionId;
            return [authActions.logInSuccess({ accessToken }), authActions.setSessionId({ sessionId })];
          }),
          tap(() => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || RoutingConstants.ROUTE_DASHBOARD;
            this.router.navigateByUrl(returnUrl);
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(authActions.authApiError());
          })
        )
      )
    )
  );

  logOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logOut),
        tap(() =>
          this.authService.logout().subscribe(() => {
            // TODO check if this is unsubscribed
            this.scktService.emit(SocketEvent.ISOFFLINE);
            this.router.navigateByUrl(RoutingConstants.ROUTE_HOME);
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
      map((payload) => payload.user),
      switchMap((user) =>
        this.authService.requestPasswordReset(user).pipe(
          map((apiResp: BaseMessage) => {
            this.toastMessageService.snack(apiResp);
            return authActions.resetPasswordSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(authActions.authApiError());
          })
        )
      )
    )
  );

  setNewPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.setNewPassword),
      map((payload) => payload.newPassword),
      switchMap((newPassword) =>
        this.authService.resetPassword(newPassword).pipe(
          map((apiResp: BaseMessage) => {
            this.toastMessageService.snack(apiResp);
            return authActions.resetPasswordSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(authActions.authApiError());
          })
        )
      )
    )
  );

  activateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.activateAccount),
      map((payload) => payload.token),
      concatMap((token) =>
        this.authService.activateAccount(token).pipe(
          map((apiResp: BaseMessage) => {
            this.toastMessageService.snack(apiResp);
            return authActions.activateAccountSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(authActions.authApiError());
          })
        )
      )
    )
  );

  redirectToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.redirectToLogin),
        withLatestFrom(this.store$.pipe(select(selectUrl))),
        map(([_, returnUrl]) => {
          const response: BaseMessage = {
            success: false,
            message: CONSTANTS.TEXTS_YOU_ARE_NOT_AUTHORIZED
          };
          this.toastMessageService.snack(response);
          this.router.navigate([RoutingConstants.ROUTE_AUTH_LOGIN], {
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
      switchMap((currentUser) => {
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
      catchError(() => of(authActions.authApiError()))
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
      exhaustMap(() =>
        this.authService.refreshSession().pipe(
          switchMap((accessToken: string) => {
            const sessionId = this.authService.getTokenDecoded(accessToken).sessionId;
            return [authActions.refreshSessionSuccess({ accessToken }), authActions.setSessionId({ sessionId })];
          }),
          catchError(() => {
            return of(authActions.refreshSessionFailure());
          })
        )
      )
    )
  );

  deleteSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.deleteSession),
      map((payload) => payload.id),
      switchMap((id) => this.authService.deleteSession(id)),
      map((apiResp: BaseMessage) => {
        this.toastMessageService.snack(apiResp);
        return authActions.deleteSessionSuccess();
      }),
      catchError(() => of(authActions.authApiError()))
    )
  );

  deleteMultipleSessions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.deleteMultipleSession),
      map((payload) => payload.sessionIds),
      switchMap((sessionIds) => this.authService.deleteSessionMultiple(sessionIds)),
      map((apiResp: BaseMessage) => {
        this.toastMessageService.snack(apiResp);
        return authActions.deleteSessionSuccess();
      }),
      catchError(() => of(authActions.authApiError()))
    )
  );

  checkIsTokenValid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.checkIsTokenValid),
      withLatestFrom(this.store$.pipe(select(getToken))),
      switchMap(([_, token]) => {
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
      map((payload) => payload.user),
      switchMap((user) => this.authService.updateProfile(user)),
      switchMap((response: ItemApiResponse<User>) => {
        this.toastMessageService.snack(response);
        return [
          authActions.updateUserProfileSuccess({ currentUser: response.data }),
          changeIsEditingState({ isEditing: false })
        ];
      }),
      catchError(() => of(authActions.authApiError()))
    )
  );

  updateUserOrg$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateUserOrgRequested),
      map((payload) => payload.organization),
      switchMap((organization) => this.authService.updateOrg(organization)),
      switchMap((response: ItemApiResponse<Organization>) => {
        this.toastMessageService.snack(response);
        return [
          authActions.updateUserOrgSuccess({ organization: response.data }),
          changeIsEditingState({ isEditing: false })
        ];
      }),
      catchError(() => of(authActions.authApiError()))
    )
  );

  ngrxOnInitEffects(): Action {
    return authActions.refreshSession();
  }
}
