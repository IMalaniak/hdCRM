import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { User } from '../models/';
import { listPageRequested } from '../store/user.actions';
import { selectUsersPage } from '../store/user.selectors';
import { DataRow } from '@/shared/models/table';

export class UsersDataSource extends CommonDataSource<User> {
  loadData(page: PageQuery) {
    this.store$
      .pipe(
        select(selectUsersPage(page)),
        tap((users) => {
          if (users.length > 0) {
            this.listSubject.next(this.mapToDataRows(users));
          } else {
            this.store$.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  mapToDataRows(users: User[]): DataRow[] {
    const dataRows = users.map((user) => ({
      id: user.id
      // TBD
    }));
    return dataRows;
  }
}
