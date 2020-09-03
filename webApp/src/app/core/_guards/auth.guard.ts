import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs';
import { tap, skipWhile } from 'rxjs/operators';
import { isLoggedIn, isLoading } from '../auth/store/auth.selectors';

import { redirectToLogin, checkIsTokenValid } from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store$: Store<AppState>) {}

  canActivate(): Observable<boolean> {
    this.store$.dispatch(checkIsTokenValid());
    return this.store$.pipe(
      skipWhile(isLoading),
      select(isLoggedIn),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.store$.dispatch(redirectToLogin());
        }
      })
    );
  }
}
