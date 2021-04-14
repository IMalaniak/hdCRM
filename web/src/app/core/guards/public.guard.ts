import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, skipWhile } from 'rxjs/operators';

import { RoutingConstants } from '@shared/constants';

import { isLoggedOut, isLoading } from '../modules/auth/store/auth.selectors';
import { AppState } from '../store';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      skipWhile(isLoading),
      select(isLoggedOut),
      tap((loggedOut) => {
        if (!loggedOut) {
          this.router.navigateByUrl(RoutingConstants.ROUTE_DASHBOARD);
        }
      })
    );
  }
}
