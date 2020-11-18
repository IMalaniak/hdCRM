import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppState } from '@/core/reducers';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { Role } from '../models/';
import { listPageRequested } from '../store/role.actions';
import { selectRolesOfPage } from '../store/role.selectors';

export class RolesDataSource extends CommonDataSource<Role> {
  constructor(private store: Store<AppState>) {
    super();
  }

  loadRoles(page: PageQuery) {
    this.store
      .pipe(
        select(selectRolesOfPage(page)),
        tap((roles) => {
          if (roles.length > 0) {
            this.listSubject.next(roles);
          } else {
            this.store.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }
}
