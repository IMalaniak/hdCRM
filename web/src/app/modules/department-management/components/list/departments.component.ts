import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { isPrivileged } from '@core/modules/auth/store/auth.selectors';
import { deleteDepartmentRequested } from '@core/modules/department-api/store';
import { AppState } from '@core/store';
import { DialogConfirmComponent } from '@shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { RoutingConstants, CommonConstants, BS_ICON } from '@shared/constants';
import { ADD_PRIVILEGE, EDIT_PRIVILEGE, DELETE_PRIVILEGE, COLUMN_KEY } from '@shared/constants';
import { DialogDataModel } from '@shared/models';
import { DialogConfirmModel } from '@shared/models/dialog/dialog-confirm.model';
import { Column, IColumn, RowActionData, ROW_ACTION_TYPE } from '@shared/models/table';
import { DialogService } from '@shared/services';

import { DepartmentsDataSource } from '../../dataSources';
import { selectDepartmentsTotalCount, selectDepartmentsPageLoading, changeIsEditingState } from '../../store';

@Component({
  templateUrl: './departments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentsComponent {
  dataSource: DepartmentsDataSource = new DepartmentsDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectDepartmentsPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectDepartmentsTotalCount));
  canAddDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGE.DEPARTMENT)));
  canEditDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.DEPARTMENT)));
  canDeleteDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGE.DEPARTMENT)));

  addDepartmentRoute = RoutingConstants.ROUTE_DEPARTMENTS_ADD;
  listIcons: { [key: string]: BS_ICON } = {
    matMenu: BS_ICON.ThreeDotsVertical,
    add: BS_ICON.Plus,
    info: BS_ICON.InfoSquare,
    edit: BS_ICON.Pencil,
    delete: BS_ICON.Trash
  };

  displayedColumns: IColumn[] = [
    Column.createSequenceNumberColumn(),
    Column.createColumn({ key: COLUMN_KEY.TITLE }),
    Column.createLinkColumn({ key: COLUMN_KEY.MANAGER, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEY.WORKERS, hasSorting: false }),
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
        this.onDepartmentSelect(data.id, false);
        break;
      case ROW_ACTION_TYPE.EDIT:
        this.onDepartmentSelect(data.id, true);
        break;
      case ROW_ACTION_TYPE.DELETE:
        this.deleteDepartment(data.id);
        break;
    }
  }

  onDepartmentSelect(id: number, edit: boolean = false): void {
    this.router.navigate([`${RoutingConstants.ROUTE_DEPARTMENTS_DETAILS}/${id}`]);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteDepartment(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CommonConstants.TEXTS_DELETE_DEPARTMENT_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deleteDepartmentRequested({ id }))
    );
  }
}
