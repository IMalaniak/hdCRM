import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/store';
import { isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { deletePlanRequested } from '@/core/modules/plan-api/store/plan';
import { DialogDataModel } from '@/shared/models';
import { RoutingConstants, CommonConstants, BS_ICON } from '@/shared/constants';
import { ADD_PRIVILEGE, EDIT_PRIVILEGE, DELETE_PRIVILEGE, COLUMN_KEY } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { Column, IColumn, RowActionData, ROW_ACTION_TYPE } from '@/shared/models/table';

import { selectPlanPageLoading, selectPlansTotalCount, changeIsEditingState } from '../../store';
import { PlansDataSource } from '../../dataSources';

@Component({
  templateUrl: './plan-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanListComponent {
  dataSource: PlansDataSource = new PlansDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectPlanPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectPlansTotalCount));
  canAddPlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGE.PLAN)));
  canEditPlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.PLAN)));
  canDeletePlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGE.PLAN)));

  addPlanRoute = RoutingConstants.ROUTE_PLANNER_ADD;
  listIcons: { [key: string]: BS_ICON } = {
    add: BS_ICON.Plus
  };

  displayedColumns: IColumn[] = [
    Column.createSequenceNumberColumn(),
    Column.createColumn({ key: COLUMN_KEY.TITLE }),
    Column.createColumn({ key: COLUMN_KEY.STAGE, hasSorting: false }),
    Column.createLinkColumn({ key: COLUMN_KEY.CREATOR, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEY.PARTICIPANTS, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEY.CREATED_AT }),
    Column.createColumn({ key: COLUMN_KEY.UPDATED_AT }),
    Column.createActionsColumn()
  ];

  constructor(
    private readonly store$: Store<AppState>,
    private readonly router: Router,
    private readonly dialogService: DialogService
  ) {}

  onRowAction(data: RowActionData<ROW_ACTION_TYPE>): void {
    switch (data.actionType) {
      case ROW_ACTION_TYPE.DETAILS:
        this.onPlanSelect(data.id, false);
        break;
      case ROW_ACTION_TYPE.EDIT:
        this.onPlanSelect(data.id, true);
        break;
      case ROW_ACTION_TYPE.DELETE:
        this.deletePlan(data.id);
        break;
    }
  }

  onPlanSelect(id: number, edit: boolean = false): void {
    this.router.navigateByUrl(`${RoutingConstants.ROUTE_PLANNER_DETAILS}/${id}`);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deletePlan(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CommonConstants.TEXTS_DELETE_PLAN_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deletePlanRequested({ id }))
    );
  }
}
