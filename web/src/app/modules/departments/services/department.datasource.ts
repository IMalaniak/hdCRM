import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { Department } from '../models/';
import { listPageRequested } from '../store/department.actions';
import { selectDepartmentsOfPage } from '../store/department.selectors';

export class DepartmentsDataSource extends CommonDataSource<Department> {
  loadData(page: PageQuery) {
    this.store$
      .pipe(
        select(selectDepartmentsOfPage(page)),
        tap((departments) => {
          if (departments.length > 0) {
            this.listSubject.next(departments);
          } else {
            this.store$.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }
}
