import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, ofType, createEffect, OnInitEffects } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import { of, timer } from 'rxjs';
import {
  tap,
  map,
  switchMap,
  catchError,
  concatMap,
  withLatestFrom,
  exhaustMap,
  delayWhen,
  filter
} from 'rxjs/operators';

import { Organization, User } from '@core/modules/user-api/shared';
import { AppState } from '@core/store';
import { initPreferences } from '@core/store/preferences';
import { selectUrl } from '@core/store/router.selectors';
import { changeIsEditingState } from '@modules/user-management/store';
import { SOCKET_EVENT, RoutingConstants, CommonConstants } from '@shared/constants';
import { BaseMessage, ItemApiResponse } from '@shared/models';
import { SocketService, ToastMessageService } from '@shared/services';

import { AuthenticationService } from '../services';
import { AuthResponse } from '../shared';

import * as authActions from './auth.actions';
import { isLoggedIn } from './auth.selectors';

@Injectable()
export class AuthEffects implements OnInitEffects {
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
        this.authService.authenticate(userLoginData).pipe(
          switchMap((response: AuthResponse) => of(authActions.logInSuccess(response))),
          tap(() => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || RoutingConstants.ROUTE_DASHBOARD;
            this.router.navigateByUrl(returnUrl);
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
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
        switchMap(() =>
          this.authService.logout().pipe(
            map(() => {
              this.scktService.emit(SOCKET_EVENT.ISOFFLINE);
              this.router.navigateByUrl(RoutingConstants.ROUTE_AUTH);
            })
          )
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
            this.toastMessageService.success(apiResp.message);
            return authActions.resetPasswordSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
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
            this.toastMessageService.success(apiResp.message);
            return authActions.resetPasswordSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
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
            this.toastMessageService.success(apiResp.message);
            return authActions.activateAccountSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
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
          this.toastMessageService.error(CommonConstants.TEXTS_YOU_ARE_NOT_AUTHORIZED);
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
      switchMap(({ data }) => {
        const currentUser = { ...data, online: true };

        this.scktService.emit(SOCKET_EVENT.ISONLINE, {
          id: currentUser.id,
          name: currentUser.name,
          surname: currentUser.surname,
          avatar: currentUser.avatar,
          OrganizationId: currentUser.OrganizationId
        });

        if (currentUser.Preference) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
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

  initSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.initSession),
      exhaustMap(() =>
        this.authService
          .refreshSession()
          .pipe(switchMap((response: AuthResponse) => of(authActions.logInSuccess(response))))
      )
    )
  );

  refreshSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.refreshSession),
      exhaustMap(() =>
        this.authService.refreshSession().pipe(
          switchMap((response: AuthResponse) => of(authActions.logInSuccess(response))),
          catchError(() => [authActions.refreshSessionFailure(), authActions.redirectToLogin()])
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logInSuccess),
      delayWhen((payload: AuthResponse) => timer(payload.expiresIn * 1000 - 60 * 1000 - Date.now())),
      withLatestFrom(this.store$.select(isLoggedIn)),
      filter(([_, isLoggedIn]) => isLoggedIn),
      switchMap(() => of(authActions.refreshSession()))
    )
  );

  deleteSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.deleteSession),
      map((payload) => payload.id),
      switchMap((id) => this.authService.deleteSession(id)),
      map((apiResp: BaseMessage) => {
        this.toastMessageService.success(apiResp.message);
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
        this.toastMessageService.success(apiResp.message);
        return authActions.deleteSessionSuccess();
      }),
      catchError(() => of(authActions.authApiError()))
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.updateUserProfileRequested),
      map((payload) => payload.user),
      switchMap((user) => this.authService.updateProfile(user)),
      switchMap((response: ItemApiResponse<User>) => {
        this.toastMessageService.success(response.message);
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
        this.toastMessageService.success(response.message);
        return [
          authActions.updateUserOrgSuccess({ organization: response.data }),
          changeIsEditingState({ isEditing: false })
        ];
      }),
      catchError(() => of(authActions.authApiError()))
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private scktService: SocketService,
    private store$: Store<AppState>,
    private toastMessageService: ToastMessageService
  ) {}

  ngrxOnInitEffects(): Action {
    return authActions.initSession();
  }
}
