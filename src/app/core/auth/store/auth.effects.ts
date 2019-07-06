import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, defer } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';

import * as fromAuth from './auth.actions';

import { AuthenticationService } from '../_services';
import Swal from 'sweetalert2';


@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    @Effect()
    LogIn$: Observable<Action> = this.actions$.pipe(
        ofType(fromAuth.AuthActionTypes.LOGIN),
        map((action: fromAuth.LogIn) => action.payload),
        switchMap(payload =>
            this.authService.login(payload).pipe(
                map(user => new fromAuth.LogInSuccess(user)),
                tap((action) => {
                  localStorage.setItem('currentUser', JSON.stringify(action.payload));
                  const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
                  this.router.navigateByUrl(returnUrl);
                }),
                catchError(error => of(new fromAuth.LogInFailure(error)))
            )
        )
    );

    @Effect({ dispatch: false })
    public LogOut$: Observable<any> = this.actions$.pipe(
      ofType(fromAuth.AuthActionTypes.LOGOUT),
      tap((action) => {
        localStorage.removeItem('currentUser');
        this.router.navigateByUrl('/home');
      })
    );

    @Effect({ dispatch: false })
    public RedirectToLogin$: Observable<any> = this.actions$.pipe(
      ofType(fromAuth.AuthActionTypes.REDIRECT_TO_LOGIN),
      tap((action) => {
        Swal.fire({
          text: 'You are not authorized to see this page, or your session has been expired!',
          type: 'error',
          timer: 3000
        });
        this.router.navigate(['/auth/login'], {queryParams: {returnUrl: action.payload}});
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
