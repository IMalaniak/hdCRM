import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';

import { Update } from '@ngrx/entity';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { ToastMessageService } from '@/shared/services';
import { CollectionApiResponse, ItemApiResponse, BaseMessage } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import { Page } from '@/shared/store';
import * as userActions from './user.actions';
import { UserService } from '../services';
import { User } from '../shared';

@Injectable()
export class UserEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.userRequested),
      map((payload) => payload.id),
      mergeMap((id) => this.userService.getOne<User>(id)),
      map((response: ItemApiResponse<User>) => userActions.userLoaded({ user: response.data })),
      catchError(() => of(userActions.userApiError()))
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((pageQuery) =>
        this.userService.getList<User>(pageQuery).pipe(
          map((response: CollectionApiResponse<User>) => {
            const page: Page = { dataIds: response.ids, key: generatePageKey(pageQuery) };
            return userActions.listPageLoaded({ response, page });
          }),
          catchError(() => of(userActions.userApiError()))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.updateUserRequested),
      map((payload) => payload.user),
      mergeMap((toUpdate) =>
        this.userService.update<User>(this.userService.formatBeforeSend(toUpdate), toUpdate.id).pipe(
          map((response: ItemApiResponse<User>) => {
            const user: Update<User> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.snack(response);
            return userActions.updateUserSuccess({ user });
          }),
          catchError(() => of(userActions.userApiError()))
        )
      )
    )
  );

  listOnlineUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.OnlineUserListRequested),
      tap(() => {
        this.userService.listOnline();
      }),
      mergeMap(() => {
        return this.userService.onlineUsersListed$.pipe(map((list) => userActions.OnlineUserListLoaded({ list })));
      })
    )
  );

  userOnline$ = createEffect(() => this.userService.userOnline$.pipe(map((user) => userActions.userOnline({ user }))));

  userOffline$ = createEffect(() =>
    this.userService.userOffline$.pipe(map((user) => userActions.userOffline({ user })))
  );

  // TODO @IMalaniak recreate this
  deleteUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.deleteUser),
        map((payload) => payload.id),
        mergeMap((id) => this.userService.delete(id)),
        map((response: BaseMessage) => of(this.toastMessageService.snack(response))),
        catchError(() => of(userActions.userApiError()))
      ),
    {
      dispatch: false
    }
  );

  inviteUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.inviteUsers),
      map((payload) => payload.users),
      mergeMap((users: User[]) =>
        this.userService.inviteUsers(users).pipe(
          map((response: CollectionApiResponse<User>) => {
            this.toastMessageService.snack(response);
            return userActions.usersInvited({ invitedUsers: response.data });
          })
        )
      ),
      catchError(() => of(userActions.userApiError()))
    )
  );

  changeOldPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.changeOldPassword),
      map((payload) => payload.newPassword),
      switchMap((newPassword) =>
        this.userService.changeOldPassword(newPassword).pipe(
          map((response: BaseMessage) => {
            this.toastMessageService.snack(response);
            return userActions.changePasswordSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(userActions.userApiError());
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private toastMessageService: ToastMessageService
  ) {}
}
