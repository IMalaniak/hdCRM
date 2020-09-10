import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs';
import { tap, skipWhile } from 'rxjs/operators';
import { isPrivileged } from '../auth/store/auth.selectors';
import { ToastMessageService } from '@/shared';
import { ALERT } from '@/shared/constants';

@Injectable({ providedIn: 'root' })
export class PrivilegeGuard implements CanActivate {
  constructor(private store$: Store<AppState>, private toastMessageService: ToastMessageService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store$.pipe(
      select(isPrivileged(route.data.privilege)),
      skipWhile((flag) => flag === undefined),
      tap((privileged) => {
        if (!privileged) {
          this.toastMessageService.popup('Sorry, You have no rights to see this page!', ALERT.WARNING).then(() => {
            return false;
          });
        }
      })
    );
  }
}
