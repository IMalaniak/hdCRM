import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { isLoggedOut } from '../auth/store/auth.selectors';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.store
            .pipe(
            select(isLoggedOut),
            tap(loggedOut => {
                if (!loggedOut) {
                    this.router.navigateByUrl('/dashboard');
                }
            })
        );
    }
}
