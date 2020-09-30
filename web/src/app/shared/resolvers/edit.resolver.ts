import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { first, map } from 'rxjs/operators';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import { RoutingConstants } from '../constants/routing.constants';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs';

@Injectable()
export class EditResolver implements Resolve<boolean> {
  constructor(private store$: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const isEditing: boolean = JSON.parse(route.queryParams[RoutingConstants.EDIT]);
    const ownerId: number = +route.queryParams[RoutingConstants.OWNER_ID];
    const privilege: string = route.data.editPrivilege;

    return combineLatest([
      this.store$.pipe(select(isPrivileged(privilege))),
      this.store$.pipe(select(currentUser))
    ]).pipe(
      map(([editPriv, appUser]) => {
        if (editPriv && isEditing) {
          return ownerId ? appUser.id === ownerId : true;
        }
        return false;
      }),
      first()
    );
  }
}
