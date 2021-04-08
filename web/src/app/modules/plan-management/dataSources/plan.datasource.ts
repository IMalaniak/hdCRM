import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Plan } from '@/core/modules/plan-api/shared';
import { listPageRequested } from '@/core/modules/plan-api/store/plan';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { COLUMN_KEY } from '@/shared/constants';
import { DataRow, Cell } from '@/shared/models/table';
import { UrlGenerator } from '@/shared/utils';
import { selectPlansOfPage } from '../store';

export class PlansDataSource extends CommonDataSource<Plan> {
  loadData(page: PageQuery): void {
    this.store$
      .pipe(
        select(selectPlansOfPage(page)),
        tap((plans) => {
          if (plans.length > 0) {
            this.listSubject.next(this.mapToDataRows(plans));
          } else {
            this.store$.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  protected mapToDataRows(plans: Plan[]): DataRow[] {
    return plans.map((plan) => ({
      id: plan.id,
      [COLUMN_KEY.SEQUENCE]: Cell.createSequenceCell(),
      [COLUMN_KEY.TITLE]: Cell.createStringCell(plan.title),
      [COLUMN_KEY.STAGE]: Cell.createStringCell(plan.activeStage?.keyString),
      [COLUMN_KEY.CREATOR]: Cell.createLinkCell(plan.Creator?.fullname, UrlGenerator.getUserUrl(plan.Creator?.id)),
      [COLUMN_KEY.PARTICIPANTS]: Cell.createStringCell(plan.Participants?.length),
      [COLUMN_KEY.CREATED_AT]: Cell.createDateCell(plan.createdAt),
      [COLUMN_KEY.UPDATED_AT]: Cell.createDateCell(plan.updatedAt),
      [COLUMN_KEY.ACTIONS]: Cell.createActionsCell()
    }));
  }
}
