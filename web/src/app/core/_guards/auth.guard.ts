import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs';
import { tap, withLatestFrom, map, take } from 'rxjs/operators';
import { isTokenValid } from '../auth/store/auth.selectors';

import { checkIsTokenValid, redirectToLogin } from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store$: Store<AppState>) {}

  canActivate(): Observable<boolean> {
    return this.store$.pipe(
      // tap(() => ),
      withLatestFrom(this.store$.pipe(select(isTokenValid))),
      take(1),
      map(([_, valid]) => valid),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.store$.dispatch(redirectToLogin());
        } else {
          this.store$.dispatch(checkIsTokenValid());
        }
      })
    );
  }
}
