import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as userActions from './user.actions';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { UserService } from '../_services';
import { AppState } from '@/core/reducers';
import { UserServerResponse, User } from '../_models';

import Swal from 'sweetalert2';

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
            return of(new UserServerResponse());
          })
        )
      ),
      map((response: UserServerResponse) => userActions.listPageLoaded({ response }))
    )
  );

  listOnlineUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.OnlineUserListRequested),
      tap(() => {
        this.userService.listOnline();
      }),
      mergeMap(() => {
        return this.userService.onlineUsersListed$.pipe(
          map(onlineUsers => userActions.OnlineUserListLoaded({ list: onlineUsers.map(user => new User(user)) }))
        );
      })
    )
  );

  userOnline$ = createEffect(() =>
    this.userService.userOnline$.pipe(map(user => userActions.userOnline({ user: new User(user) })))
  );

  userOffline$ = createEffect(() =>
    this.userService.userOffline$.pipe(map(user => userActions.userOffline({ user: new User(user) })))
  );

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
              type: 'success',
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

  constructor(private actions$: Actions, private store: Store<AppState>, private userService: UserService) {}
}
