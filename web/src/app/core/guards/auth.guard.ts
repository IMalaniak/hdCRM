﻿import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, withLatestFrom, map, take } from 'rxjs/operators';

import { redirectToLogin } from '../modules/auth/store/auth.actions';
import { isLoggedIn } from '../modules/auth/store/auth.selectors';
import { AppState } from '../store';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store$: Store<AppState>) {}

  canActivate(): Observable<boolean> {
    return this.store$.pipe(
      withLatestFrom(this.store$.pipe(select(isLoggedIn))),
      take(1),
      map(([_, valid]) => valid),
      tap((loggedIn) => {
        if (!loggedIn) {
          this.store$.dispatch(redirectToLogin());
        }
      })
    );
  }
}
