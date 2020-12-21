import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Plan } from '@/core/modules/plan-api/shared';
import { listPageRequested } from '@/core/modules/plan-api/store/plan';
import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { COLUMN_NAMES } from '@/shared/constants';
import { DataRow, CellValue } from '@/shared/models/table';
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
      [COLUMN_NAMES.SEQUENCE_NUMBER]: CellValue.createSequenceCell(),
      [COLUMN_NAMES.TITLE]: CellValue.createStringCell(plan.title),
      [COLUMN_NAMES.STAGE]: CellValue.createStringCell(plan.activeStage?.keyString),
      [COLUMN_NAMES.CREATOR]: CellValue.createLinkCell(
        plan.Creator?.fullname,
        UrlGenerator.getUserUrl(plan.Creator?.id)
      ),
      [COLUMN_NAMES.PARTICIPANTS]: CellValue.createStringCell(plan.Participants?.length),
      [COLUMN_NAMES.CREATED_AT]: CellValue.createDateCell(plan.createdAt),
      [COLUMN_NAMES.UPDATED_AT]: CellValue.createDateCell(plan.updatedAt),
      [COLUMN_NAMES.ACTIONS]: CellValue.createActionsCell()
    }));
  }
}
