import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from '../_models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectUserById } from '../store/user.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { UserRequested } from '../store/user.actions';

@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    const userId = route.params['id'];

    return this.store.pipe(
      select(selectUserById(userId)),
      tap(user => {
        if (!user) {
          this.store.dispatch(new UserRequested({ userId }));
        }
      }),
      filter(user => !!user),
      first()
    );
  }
}
