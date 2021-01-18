import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { listPageRequested } from '@/core/modules/department-api/store';
import { Department } from '@/core/modules/department-api/shared';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { COLUMN_NAMES } from '@/shared/constants/table.constants';
import { UrlGenerator } from '@/shared/utils/url.generator';
import { DataRow, CellValue } from '@/shared/models/table';
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
      [COLUMN_NAMES.SEQUENCE]: CellValue.createSequenceCell(),
      [COLUMN_NAMES.TITLE]: CellValue.createStringCell(department.title),
      [COLUMN_NAMES.MANAGER]: CellValue.createLinkCell(
        department.Manager?.fullname,
        UrlGenerator.getUserUrl(department.Manager?.id)
      ),
      [COLUMN_NAMES.WORKERS]: CellValue.createStringCell(department.Workers?.length),
      [COLUMN_NAMES.CREATED_AT]: CellValue.createDateCell(department.createdAt),
      [COLUMN_NAMES.UPDATED_AT]: CellValue.createDateCell(department.updatedAt),
      [COLUMN_NAMES.ACTIONS]: CellValue.createActionsCell()
    }));
  }
}
