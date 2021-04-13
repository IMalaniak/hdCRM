import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { listPageRequested } from '@/core/modules/department-api/store';
import { Department } from '@/core/modules/department-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { COLUMN_KEY } from '@/shared/constants/table.constants';
import { UrlGenerator } from '@/shared/utils/url.generator';
import { DataRow, Cell } from '@/shared/models/table';

import { selectDepartmentsOfPage } from '../store/department.selectors';

export class DepartmentsDataSource extends CommonDataSource<Department> {
  loadData(page: PageQuery): void {
    this.store$
      .pipe(
        select(selectDepartmentsOfPage(page)),
        tap((departments) => {
          if (departments.length > 0) {
            this.listSubject.next(this.mapToDataRows(departments));
          } else {
            this.store$.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  protected mapToDataRows(departments: Department[]): DataRow[] {
    return departments.map((department) => ({
      id: department.id,
      [COLUMN_KEY.SEQUENCE]: Cell.createSequenceCell(),
      [COLUMN_KEY.TITLE]: Cell.createStringCell(department.title),
      [COLUMN_KEY.MANAGER]: Cell.createLinkCell(
        department.Manager?.fullname,
        UrlGenerator.getUserUrl(department.Manager?.id)
      ),
      [COLUMN_KEY.WORKERS]: Cell.createStringCell(department.Workers?.length),
      [COLUMN_KEY.CREATED_AT]: Cell.createDateCell(department.createdAt),
      [COLUMN_KEY.UPDATED_AT]: Cell.createDateCell(department.updatedAt),
      [COLUMN_KEY.ACTIONS]: Cell.createActionsCell()
    }));
  }
}
