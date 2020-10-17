import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as userActions from './user.actions';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';
import { UserService } from '../services';
import { User } from '../models';
import { Update } from '@ngrx/entity';
import { ToastMessageService } from '@/shared/services';
import { CollectionServiceMessage, ItemServiceMessage, ServiceMessage } from '@/shared/models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.userRequested),
      map((payload) => payload.id),
      mergeMap((id) => this.userService.getUser(id)),
      map((response: ItemServiceMessage<User>) => userActions.userLoaded({ user: response.data })),
      catchError(() => of(userActions.userApiError()))
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((page) =>
        this.userService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: CollectionServiceMessage<User>) => userActions.listPageLoaded({ response })),
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
        this.userService.updateUser(toUpdate).pipe(
          map((response: ItemServiceMessage<User>) => {
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
        map((response: ServiceMessage) => of(this.toastMessageService.snack(response))),
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
          map((response: CollectionServiceMessage<User>) => {
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
          map((response: ServiceMessage) => {
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
