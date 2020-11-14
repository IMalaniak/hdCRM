import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { Role } from '../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectRoleDeepById } from '../store/role.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { roleRequested } from '../store/role.actions';

@Injectable()
export class RoleResolver implements Resolve<Role> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Role> {
    const id = route.params['id'];

    return this.store.pipe(
      select(selectRoleDeepById(id)),
      tap((role) => {
        if (!role) {
          this.store.dispatch(roleRequested({ id }));
        }
      }),
      filter((role) => !!role),
      first()
    );
  }
}
