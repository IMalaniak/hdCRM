import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppState } from '@/core/reducers';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { User } from '../models/';
import { listPageRequested } from '../store/user.actions';
import { selectUsersPage } from '../store/user.selectors';

export class UsersDataSource extends CommonDataSource<User> {
  constructor(private store: Store<AppState>) {
    super();
  }

  loadUsers(page: PageQuery) {
    this.store
      .pipe(
        select(selectUsersPage(page)),
        tap((users) => {
          if (users.length > 0) {
            this.listSubject.next(users);
          } else {
            this.store.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }
}
