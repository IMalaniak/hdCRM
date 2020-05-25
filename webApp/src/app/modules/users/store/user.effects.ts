import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as userActions from './user.actions';
import { mergeMap, map, catchError, tap, switchMap } from 'rxjs/operators';
import { UserService } from '../services';
import { AppState } from '@/core/reducers';
import { UserServerResponse, User } from '../models';

import Swal from 'sweetalert2';
import { Update } from '@ngrx/entity';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class UserEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.userRequested),
      map(payload => payload.id),
      mergeMap(id => this.userService.getUser(id)),
      map(user => userActions.userLoaded({ user }))
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.listPageRequested),
      map(payload => payload.page),
      mergeMap(page =>
        this.userService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          catchError(err => {
            this.store.dispatch(userActions.listPageCancelled());
            return of({});
          })
        )
      ),
      map((response: UserServerResponse) => userActions.listPageLoaded({ response }))
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.updateUserRequested),
      map(payload => payload.user),
      mergeMap(toUpdate =>
        this.userService.updateUser(toUpdate).pipe(
          catchError(err => {
            userActions.updateUserCancelled();
            return of(
              Swal.fire({
                text: 'Ooops, something went wrong!',
                icon: 'error',
                timer: 3000
              })
            );
          })
        )
      ),
      map((data: User) => {
        const user: Update<User> = {
          id: data.id,
          changes: data
        };
        Swal.fire({
          text: 'User updated!',
          icon: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
        return userActions.updateUserSuccess({ user });
      })
    )
  );

  listOnlineUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.OnlineUserListRequested),
      tap(() => {
        this.userService.listOnline();
      }),
      mergeMap(() => {
        return this.userService.onlineUsersListed$.pipe(map(list => userActions.OnlineUserListLoaded({ list })));
      })
    )
  );

  userOnline$ = createEffect(() => this.userService.userOnline$.pipe(map(user => userActions.userOnline({ user }))));

  userOffline$ = createEffect(() => this.userService.userOffline$.pipe(map(user => userActions.userOffline({ user }))));

  deleteUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.deleteUser),
        map(payload => payload.id),
        mergeMap(id => this.userService.delete(id)),
        map(() =>
          of(
            Swal.fire({
              text: `User deleted`,
              icon: 'success',
              timer: 6000,
              toast: true,
              showConfirmButton: false,
              position: 'bottom-end'
            })
          )
        )
      ),
    {
      dispatch: false
    }
  );

  inviteUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.inviteUsers),
      map(payload => payload.users),
      mergeMap((users: User[]) =>
        this.userService.inviteUsers(users).pipe(
          map(invitedUsers => {
            return userActions.usersInvited({ invitedUsers });
          })
        )
      )
    )
  );

  changeOldPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.changeOldPassword),
      map(payload => payload.newPassword),
      switchMap(newPassword =>
        this.userService.changeOldPassword(newPassword).pipe(
          map(response => userActions.changePasswordSuccess({ response })),
          catchError((errorResponse: HttpErrorResponse) =>
            of(userActions.changePasswordFailure({ response: errorResponse.error }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private store: Store<AppState>, private userService: UserService) {}
}
