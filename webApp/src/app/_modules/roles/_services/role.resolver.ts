


import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';

import { Role } from '../_models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectRoleById } from '../store/role.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { RoleRequested } from '../store/role.actions';

@Injectable()
export class RoleResolver implements Resolve<Role> {

    constructor(
        private store: Store<AppState>) {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Role> {

        const roleId = route.params['id'];

        return this.store.pipe(
            select(selectRoleById(roleId)),
            tap(role => {
                if (!role) {
                    this.store.dispatch(new RoleRequested({roleId}));
                }
            }),
            filter(role => !!role),
            first()
        );
    }

}

