import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store, select } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPrivileged } from '../auth/store/auth.selectors';

@Injectable({ providedIn: 'root' })
export class PrivilegeGuard implements CanActivate {
    constructor(
        private store$: Store<AppState>,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.store$.pipe(
            select(isPrivileged(route.data.privilege)),
            tap(privileged => {
                if (!privileged) {
                    Swal.fire({
                        title: 'Sorry, You have no rights to see this page!',
                        type: 'error',
                        timer: 3000,
                        showCancelButton: false,
                        showCloseButton: false,
                    }).then(() => {
                        return false;
                    });
                }
            })
        );
    }

}
