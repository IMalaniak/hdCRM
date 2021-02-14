import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { listPageRequested } from '@/core/modules/role-api/store/role';
import { Role } from '@/core/modules/role-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { Cell, DataRow } from '@/shared/models/table';
import { selectRolesOfPage } from '../store/role.selectors';
import { COLUMN_KEYS } from '@/shared/constants/table.constants';

export class RolesDataSource extends CommonDataSource<Role> {
  loadData(page: PageQuery): void {
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

  protected mapToDataRows(roles: Role[]): DataRow[] {
    return roles.map((role) => ({
      id: role.id,
      [COLUMN_KEYS.SEQUENCE]: Cell.createSequenceCell(),
      [COLUMN_KEYS.TITLE]: Cell.createStringCell(role.keyString),
      [COLUMN_KEYS.USERS]: Cell.createStringCell(role.Users?.length),
      [COLUMN_KEYS.PRIVILEGES]: Cell.createStringCell(role.Privileges?.length),
      [COLUMN_KEYS.CREATED_AT]: Cell.createDateCell(role.createdAt),
      [COLUMN_KEYS.UPDATED_AT]: Cell.createDateCell(role.updatedAt),
      [COLUMN_KEYS.ACTIONS]: Cell.createActionsCell()
    }));
  }
}
