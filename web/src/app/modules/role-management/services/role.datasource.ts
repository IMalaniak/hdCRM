import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { listPageRequested } from '@/core/modules/role-api/store/role';
import { Role } from '@/core/modules/role-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { CellValue, DataRow } from '@/shared/models/table';
import { selectRolesOfPage } from '../store/role.selectors';
import { COLUMN_NAMES } from '@/shared/constants/table.constants';

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

  protected mapToDataRows(roles: Role[]): DataRow[] {
    return roles.map((role) => ({
      id: role.id,
      [COLUMN_NAMES.SEQUENCE_NUMBER]: CellValue.createSequenceCell(),
      [COLUMN_NAMES.TITLE]: CellValue.createStringCell(role.keyString),
      [COLUMN_NAMES.USERS]: CellValue.createStringCell(role.Users?.length),
      [COLUMN_NAMES.PRIVILEGES]: CellValue.createStringCell(role.Privileges?.length),
      [COLUMN_NAMES.CREATED_AT]: CellValue.createDateCell(role.createdAt),
      [COLUMN_NAMES.UPDATED_AT]: CellValue.createDateCell(role.updatedAt),
      [COLUMN_NAMES.ACTIONS]: CellValue.createActionsCell()
    }));
  }
}
