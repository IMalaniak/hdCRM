import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { Plan } from '../models/';
import { listPageRequested } from '../store/plan.actions';
import { selectPlansOfPage } from '../store/plan.selectors';

export class PlansDataSource extends CommonDataSource<Plan> {
  loadData(page: PageQuery): void {
    this.store$
      .pipe(
        select(selectPlansOfPage(page)),
        tap((plans) => {
          if (plans.length > 0) {
            this.listSubject.next(plans);
          } else {
            this.store$.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }
}
