import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppState } from '@/core/store';
import { Plan } from '@/core/modules/plan-api/shared';
import { listPageRequested } from '@/core/modules/plan-api/store/plan';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { selectPlansOfPage } from '../store';

export class PlansDataSource extends CommonDataSource<Plan> {
  constructor(private store: Store<AppState>) {
    super();
  }

  loadPlans(page: PageQuery) {
    this.store
      .pipe(
        select(selectPlansOfPage(page)),
        tap((plans) => {
          if (plans.length > 0) {
            this.listSubject.next(plans);
          } else {
            this.store.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }
}
