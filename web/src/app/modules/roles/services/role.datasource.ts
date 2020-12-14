import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { DataRow } from '@/shared/models/table';
import { Role } from '../models/';
import { listPageRequested } from '../store/role.actions';
import { selectRolesOfPage } from '../store/role.selectors';

export class RolesDataSource extends CommonDataSource<Role> {
  loadData(page: PageQuery) {
    this.store$
      .pipe(
        select(selectRolesOfPage(page)),
        tap((roles) => {
          if (roles.length > 0) {
            this.listSubject.next(this.mapToDataRows(roles));
          } else {
            this.store$.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  mapToDataRows(roles: Role[]): DataRow[] {
    const dataRows = roles.map((role) => ({
      id: role.id
      // TBD
    }));
    return dataRows;
  }
}
