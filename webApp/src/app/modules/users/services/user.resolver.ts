import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from '../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectUserById } from '../store/user.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { userRequested } from '../store/user.actions';

@Injectable()
export class UserResolver implements Resolve<Observable<User>> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const id = route.params['id'];

    return this.store.pipe(
      select(selectUserById(id)),
      tap(user => {
        if (!user) {
          this.store.dispatch(userRequested({ id }));
        }
      }),
      filter(user => !!user),
      first()
    );
  }
}
