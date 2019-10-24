import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as userActions from './user.actions';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { UserService, StateService } from '../_services';
import { AppState } from '@/core/reducers';
import { allUsersLoaded, allStatesLoaded } from './user.selectors';
import { UserServerResponse } from '../_models';

import Swal from 'sweetalert2';

@Injectable()
export class UserEffects {

    @Effect()
    loadUser$: Observable<Action> = this.actions$.pipe(
        ofType<userActions.UserRequested>(userActions.UserActionTypes.USER_REQUESTED),
        mergeMap(action => this.userService.getUser(action.payload.userId)),
        map(user => new userActions.UserLoaded({user}))
    );

    @Effect()
    loadUsers$ = this.actions$.pipe(
        ofType<userActions.UserListPageRequested>(userActions.UserActionTypes.USER_LIST_PAGE_REQUESTED),
        mergeMap(({payload}) =>
                this.userService.getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
                  .pipe(
                    catchError(err => {
                      console.log('error loading a users page ', err);
                      this.store.dispatch(new userActions.UserListPageCancelled());
                      return of(new UserServerResponse());
                    })
                  )
        ),
        map((response: UserServerResponse) => new userActions.UserListPageLoaded(response)),
    );

    @Effect({dispatch: false})
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

    @Effect()
    loadAllStates$ = this.actions$.pipe(
        ofType<userActions.AllStatesRequested>(userActions.UserActionTypes.ALLSTATES_REQUESTED),
        withLatestFrom(this.store.pipe(select(allStatesLoaded))),
        filter(([action, allStatesLoaded]) => !allStatesLoaded),
        mergeMap(() => this.stateService.getList()),
        map(states => new userActions.AllStatesLoaded({states})),
        catchError(err => {
          console.log('error loading all states ', err);
          return throwError(err);
        })
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private userService: UserService,
        private stateService: StateService
    ) {}
}
