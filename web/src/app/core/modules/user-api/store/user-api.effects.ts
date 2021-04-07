import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';

import { Update } from '@ngrx/entity';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { ToastMessageService } from '@/shared/services';
import { CollectionApiResponse, ItemApiResponse, BaseMessage } from '@/shared/models';
import { Page } from '@/shared/store';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as userApiActions from './user-api.actions';
import { UserService } from '../services';
import { User } from '../shared';

@Injectable()
export class UserEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userApiActions.userRequested),
      map((payload) => payload.id),
      mergeMap((id) => this.userService.getOne<User>(id)),
      map((response: ItemApiResponse<User>) => userApiActions.userLoaded({ user: response.data })),
      catchError(() => of(userApiActions.userApiError()))
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userApiActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((pageQuery) =>
        this.userService.getList<User>(pageQuery).pipe(
          map((response: CollectionApiResponse<User>) => {
            const page: Page = { dataIds: response.ids, key: generatePageKey(pageQuery) };
            return userApiActions.listPageLoaded({ response, page });
          }),
          catchError(() => of(userApiActions.userApiError()))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userApiActions.updateUserRequested),
      map((payload) => payload.user),
      mergeMap((toUpdate) =>
        this.userService.update<User>(this.userService.formatBeforeSend(toUpdate), toUpdate.id).pipe(
          map((response: ItemApiResponse<User>) => {
            const user: Update<User> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.success(response.message);
            return userApiActions.updateUserSuccess({ user });
          }),
          catchError(() => of(userApiActions.userApiError()))
        )
      )
    )
  );

  listOnlineUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userApiActions.OnlineUserListRequested),
      tap(() => {
        this.userService.listOnline();
      }),
      mergeMap(() => {
        return this.userService.onlineUsersListed$.pipe(map((list) => userApiActions.OnlineUserListLoaded({ list })));
      })
    )
  );

  userOnline$ = createEffect(() =>
    this.userService.userOnline$.pipe(map((user) => userApiActions.userOnline({ user })))
  );

  userOffline$ = createEffect(() =>
    this.userService.userOffline$.pipe(map((user) => userApiActions.userOffline({ user })))
  );

  // TODO @IMalaniak recreate this
  deleteUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userApiActions.deleteUser),
        map((payload) => payload.id),
        mergeMap((id) => this.userService.delete(id)),
        map((response: BaseMessage) => of(this.toastMessageService.success(response.message))),
        catchError(() => of(userApiActions.userApiError()))
      ),
    {
      dispatch: false
    }
  );

  inviteUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userApiActions.inviteUsers),
      map((payload) => payload.users),
      mergeMap((users: User[]) =>
        this.userService.inviteUsers(users).pipe(
          map((response: CollectionApiResponse<User>) => {
            this.toastMessageService.success(response.message);
            return userApiActions.usersInvited({ invitedUsers: response.data });
          })
        )
      ),
      catchError(() => of(userApiActions.userApiError()))
    )
  );

  changeOldPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userApiActions.changeOldPassword),
      map((payload) => payload.newPassword),
      switchMap((newPassword) =>
        this.userService.changeOldPassword(newPassword).pipe(
          map((response: BaseMessage) => {
            this.toastMessageService.success(response.message);
            return userApiActions.changePasswordSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
            return of(userApiActions.userApiError());
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly userService: UserService,
    private readonly toastMessageService: ToastMessageService
  ) {}
}
