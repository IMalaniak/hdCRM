import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { PlansDataSource } from '../../services/plan.datasource';
import { selectPlanPageLoading, selectPlansTotalCount } from '../../store/plan.selectors';
import { DialogDataModel } from '@/shared/models';
import { RoutingConstants, CONSTANTS, BS_ICONS } from '@/shared/constants';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { deletePlanRequested, changeIsEditingState } from '../../store/plan.actions';
import { ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, COLUMN_NAMES } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { DataColumn, HorizontalAlign } from '@/shared/models/table';

@Component({
  templateUrl: './plan-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanListComponent {
  dataSource: PlansDataSource = new PlansDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectPlanPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectPlansTotalCount));
  canAddPlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.PLAN)));
  canEditPlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.PLAN)));
  canDeletePlan$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.PLAN)));

  addPlanRoute = RoutingConstants.ROUTE_PLANNER_ADD;
  listIcons: { [key: string]: BS_ICONS } = {
    add: BS_ICONS.Plus
  };

  displayedColumns: DataColumn[] = [
    new DataColumn(COLUMN_NAMES.TITLE),
    new DataColumn(COLUMN_NAMES.STAGE, HorizontalAlign.Left, true, false),
    new DataColumn(COLUMN_NAMES.CREATOR, HorizontalAlign.Left, true, false),
    new DataColumn(COLUMN_NAMES.PARTICIPANTS, HorizontalAlign.Left, true, false),
    new DataColumn(COLUMN_NAMES.CREATED_AT),
    new DataColumn(COLUMN_NAMES.UPDATED_AT),
    DataColumn.createActionsColumn()
  ];

  constructor(private store$: Store<AppState>, private router: Router, private dialogService: DialogService) {}

  onPlanSelect(id: number, edit: boolean = false): void {
    this.router.navigateByUrl(`${RoutingConstants.ROUTE_PLANNER_DETAILS}/${id}`);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deletePlan(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_PLAN_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deletePlanRequested({ id }))
    );
  }
}
