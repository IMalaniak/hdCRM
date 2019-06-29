import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Swal from 'sweetalert2';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable, of } from 'rxjs';
import { tap, mergeMap, first } from 'rxjs/operators';
import { isloggedIn, isValidToken } from '../auth/store/auth.selectors';

import { JwtHelperService } from '@auth0/angular-jwt';
import { LogOut } from '../auth/store/auth.actions';
const jwtHelper = new JwtHelperService();


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private store$: Store<AppState>,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store$
            .pipe(
            select(isloggedIn),
            tap(loggedIn => {
                if (loggedIn) {
                    // TODO
                    this.checkToken();
                } else if (!loggedIn) {
                    Swal.fire({
                        title: 'You are not authorized to see this page!',
                        type: 'error',
                        timer: 1500
                    });
                    this.router.navigateByUrl('/auth/login');
                }
            })
        );
    }

    private checkToken(): Observable<boolean> {
        return this.store$.pipe(
            select(isValidToken),
            tap(isValid => {
                if (!isValid) {
                    Swal.fire({
                        title: 'Token has expired!',
                        type: 'error',
                        timer: 1500
                    });
                    this.store$.dispatch(new LogOut());
                }
            })
        );
    }
}
