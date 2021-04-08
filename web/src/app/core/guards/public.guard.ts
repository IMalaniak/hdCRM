import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, skipWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { ROUTING } from '@/shared/constants';
import { AppState } from '../store';
import { isLoggedOut, isLoading } from '../modules/auth/store/auth.selectors';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.pipe(
      skipWhile(isLoading),
      select(isLoggedOut),
      tap((loggedOut) => {
        if (!loggedOut) {
          this.router.navigateByUrl(ROUTING.ROUTE_DASHBOARD);
        }
      })
    );
  }
}
