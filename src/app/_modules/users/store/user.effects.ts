import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UserRequested, UserActionTypes, UserLoaded, AllUsersRequested, AllUsersLoaded, UserListPageCancelled, UserListPageRequested, UserListPageLoaded, AllStatesRequested, AllStatesLoaded } from './user.actions';
import { mergeMap, map, withLatestFrom, filter, catchError } from 'rxjs/operators';
import { UserService, StateService } from '../_services';
import { AppState } from '@/core/reducers';
import { allUsersLoaded, allStatesLoaded } from './user.selectors';
import { UserServerResponse } from '../_models';

@Injectable()
export class UserEffects {

    @Effect()
    loadUser$: Observable<Action> = this.actions$.pipe(
        ofType<UserRequested>(UserActionTypes.UserRequested),
        mergeMap(action => this.userService.getUser(action.payload.userId)),
        map(user => new UserLoaded({user}))
    );

    @Effect()
    loadUsers$ = this.actions$.pipe(
        ofType<UserListPageRequested>(UserActionTypes.UserListPageRequested),
        mergeMap(({payload}) =>
                this.userService.getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
                  .pipe(
                    catchError(err => {
                      console.log('error loading a users page ', err);
                      this.store.dispatch(new UserListPageCancelled());
                      return of(new UserServerResponse());
                    })
                  )
        ),
        map((response: UserServerResponse) => new UserListPageLoaded(response)),
    );

    
    // @Effect()
    // loadAllUsers$ = this.actions$.pipe(
    //     ofType<AllUsersRequested>(UserActionTypes.AllUsersRequested),
    //     withLatestFrom(this.store.pipe(select(allUsersLoaded))),
    //     filter(([action, allUsersLoaded]) => !allUsersLoaded),
    //     mergeMap(() => this.userService.getList()),
    //     map(users => new AllUsersLoaded({users})),
    //     // catchError(err => {
    //     //   console.log('error loading all courses ', err);
    //     //   return throwError(err);
    //     // })
    // );
    
    @Effect()
    loadAllStates$ = this.actions$.pipe(
        ofType<AllStatesRequested>(UserActionTypes.AllStatesRequested),
        withLatestFrom(this.store.pipe(select(allStatesLoaded))),
        filter(([action, allStatesLoaded]) => !allStatesLoaded),
        mergeMap(() => this.stateService.getList()),
        map(states => new AllStatesLoaded({states})),
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
