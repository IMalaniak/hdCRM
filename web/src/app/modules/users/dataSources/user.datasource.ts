import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppState } from '@/core/store';
import { listPageRequested } from '@/core/modules/user-api/store';
import { User } from '@/core/modules/user-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { selectUsersPage } from '../store';

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
