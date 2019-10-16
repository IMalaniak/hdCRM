import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isloggedIn } from '../auth/store/auth.selectors';

import { RedirectToLogin } from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private store$: Store<AppState>
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store$
            .pipe(
            select(isloggedIn),
            tap(loggedIn => {
                if (!loggedIn) {
                    this.store$.dispatch(new RedirectToLogin(state.url));
                }
            })
        );
    }

}
