import { select } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PageQuery } from '@/shared/models';
import { CommonDataSource } from '@/shared/services';
import { CellValue, DataRow } from '@/shared/models/table';

import { listPageRequested } from '../store/plan.actions';
import { selectPlansOfPage } from '../store/plan.selectors';
import { Plan } from '../models';
import { COLUMN_NAMES } from '@/shared/constants';

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

  mapToDataRows(plans: Plan[]): DataRow[] {
    const dataRows = plans.map((plan) => ({
      id: plan.id,
      [COLUMN_NAMES.TITLE]: CellValue.createSpanCell(plan.title),
      [COLUMN_NAMES.STAGE]: CellValue.createSpanCell(plan.activeStage.keyString),
      [COLUMN_NAMES.CREATOR]: CellValue.createSpanCell(plan.Creator?.fullname || '-'),
      [COLUMN_NAMES.PARTICIPANTS]: CellValue.createSpanCell(plan.Participants?.length.toString() || '-'),
      [COLUMN_NAMES.CREATED_AT]: CellValue.createSpanCell(plan.createdAt.toString()),
      [COLUMN_NAMES.UPDATED_AT]: CellValue.createSpanCell(plan.updatedAt.toString()),
      [COLUMN_NAMES.ACTIONS]: CellValue.createActionsCell()
    }));
    return dataRows;
  }
}
