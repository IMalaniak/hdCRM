import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, skipWhile } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { isPrivileged } from '../auth/store/auth.selectors';
import { ToastMessageService } from '@/shared/services';
import { CONSTANTS } from '@/shared/constants';
import { ServiceMessage } from '@/shared/models/serviceMessage';

@Injectable({ providedIn: 'root' })
export class PrivilegeGuard implements CanActivate {
  constructor(private store$: Store<AppState>, private toastMessageService: ToastMessageService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store$.pipe(
      select(isPrivileged(route.data.privilege)),
      skipWhile((flag) => flag === undefined),
      tap((privileged) => {
        if (!privileged) {
          const response: ServiceMessage = {
            success: false,
            message: CONSTANTS.TEXTS_PRIVILEGE_GUARD_ERROR
          };
          this.toastMessageService.snack(response);
        }
      })
    );
  }
}
