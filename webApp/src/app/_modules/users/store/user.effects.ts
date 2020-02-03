import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as userActions from './user.actions';
import { mergeMap, map, catchError, tap } from 'rxjs/operators';
import { UserService } from '../_services';
import { AppState } from '@/core/reducers';
import { UserServerResponse, User } from '../_models';

import Swal from 'sweetalert2';

@Injectable()
export class UserEffects {
  @Effect()
  loadUser$: Observable<Action> = this.actions$.pipe(
    ofType<userActions.UserRequested>(userActions.UserActionTypes.USER_REQUESTED),
    mergeMap(action => this.userService.getUser(action.payload.userId)),
    map(user => new userActions.UserLoaded({ user }))
  );

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType<userActions.UserListPageRequested>(userActions.UserActionTypes.USER_LIST_PAGE_REQUESTED),
    mergeMap(({ payload }) =>
      this.userService
        .getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
        .pipe(
          catchError(err => {
            console.log('error loading a users page ', err);
            this.store.dispatch(new userActions.UserListPageCancelled());
            return of(new UserServerResponse());
          })
        )
    ),
    map((response: UserServerResponse) => new userActions.UserListPageLoaded(response))
  );

  @Effect()
  listOnlineUsers$ = this.actions$.pipe(
    ofType<userActions.OnlineUserListRequested>(userActions.UserActionTypes.ONLINE_USER_LIST_REQUESTED),
    tap(() => {
      this.userService.listOnline();
    }),
    mergeMap(() => {
      return this.userService.onlineUsersListed$.pipe(
        map(onlineUsers => new userActions.OnlineUserListLoaded(onlineUsers.map(user => new User(user))))
      );
    })
  );

  @Effect()
  userOnline$ = this.userService.userOnline$.pipe(
    map(user => new userActions.UserOnline(new User(user)))
  );

  @Effect()
  userOffline$ = this.userService.userOffline$.pipe(
    map(user => new userActions.UserOffline(new User(user)))
  );

  @Effect({ dispatch: false })
  deleteUser$ = this.actions$.pipe(
    ofType<userActions.DeleteUser>(userActions.UserActionTypes.DELETE_USER),
    mergeMap(action => this.userService.delete(action.payload.userId)),
    map(() => {
      Swal.fire({
        text: `User deleted`,
        type: 'success',
        timer: 6000,
        toast: true,
        showConfirmButton: false,
        position: 'bottom-end'
      });
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private userService: UserService
  ) {}
}
