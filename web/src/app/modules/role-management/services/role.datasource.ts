import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppState } from '@/core/store';
import { listPageRequested } from '@/core/modules/role-api/store/role';
import { Role } from '@/core/modules/role-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
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
