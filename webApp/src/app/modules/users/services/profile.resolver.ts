import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from '../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { first } from 'rxjs/operators';
import { currentUser } from '@/core/auth/store/auth.selectors';

@Injectable()
export class ProfileResolver implements Resolve<Observable<User>> {
  constructor(private store: Store<AppState>) {}

  resolve(): Observable<User> {
    // TODO: @IMalaniak profile is not showing on page reload
    return this.store.pipe(select(currentUser), first());
  }
}
