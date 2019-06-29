import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, defer } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import * as fromAuth from './auth.actions';

import { AuthenticationService } from '../_services';


@Injectable()
export class AuthEffects {

    constructor(
        private actions$: Actions,
        private authService: AuthenticationService,
        private router: Router,
    ) {}

    @Effect()
    LogIn$: Observable<Action> = this.actions$.pipe(
        ofType(fromAuth.AuthActionTypes.LOGIN),
        map((action: fromAuth.LogIn) => action.payload),
        switchMap(payload =>
            this.authService.login(payload).pipe(
                map(user => (new fromAuth.LogInSuccess(user))),
                tap((action) => {
                  localStorage.setItem('currentUser', JSON.stringify(action.payload));
                  this.router.navigateByUrl('/dashboard');
                }),
                catchError(error => of(new fromAuth.LogInFailure(error)))
            )
        )
    );

    @Effect({ dispatch: false })
    LogInSuccess$: Observable<any> = this.actions$.pipe(
      ofType(fromAuth.AuthActionTypes.LOGIN_SUCCESS),
      map((action: fromAuth.LogInSuccess) => action.payload),
    );

    @Effect({ dispatch: false })
    LogInFailure$: Observable<any> = this.actions$.pipe(
      ofType(fromAuth.AuthActionTypes.LOGIN_FAILURE)
    );

    @Effect({ dispatch: false })
    public LogOut: Observable<any> = this.actions$.pipe(
      ofType(fromAuth.AuthActionTypes.LOGOUT),
      tap((user) => {
        this.router.navigateByUrl('/auth/login');
        localStorage.removeItem('currentUser');
      })
    );

    @Effect()
    init$ = defer(() => {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
         return of(new fromAuth.LogInSuccess(JSON.parse(userData)));
      }
      // TODO: cannot access public routes
      // else {
      //   return <any> of(new fromAuth.LogOut());
      // }
    });

}
