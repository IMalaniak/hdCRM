import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { deleteDepartmentRequested } from '@/core/modules/department-api/store';
import { DialogDataModel } from '@/shared/models';
import { RoutingConstants, CONSTANTS, BS_ICONS } from '@/shared/constants';
import { ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, COLUMN_KEYS } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { DataColumn } from '@/shared/models/table';
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
  canAddDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.DEPARTMENT)));
  canEditDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.DEPARTMENT)));
  canDeleteDep$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.DEPARTMENT)));

  addDepartmentRoute = RoutingConstants.ROUTE_DEPARTMENTS_ADD;
  listIcons: { [key: string]: BS_ICONS } = {
    matMenu: BS_ICONS.ThreeDotsVertical,
    add: BS_ICONS.Plus,
    info: BS_ICONS.InfoSquare,
    edit: BS_ICONS.Pencil,
    delete: BS_ICONS.Trash
  };

  displayedColumns: DataColumn[] = [
    DataColumn.createSequenceNumberColumn(),
    DataColumn.createColumn({ key: COLUMN_KEYS.TITLE }),
    DataColumn.createLinkColumn({ key: COLUMN_KEYS.MANAGER }),
    DataColumn.createColumn({ key: COLUMN_KEYS.WORKERS }),
    DataColumn.createColumn({ key: COLUMN_KEYS.CREATED_AT }),
    DataColumn.createColumn({ key: COLUMN_KEYS.UPDATED_AT }),
    DataColumn.createActionsColumn()
  ];

  constructor(
    private readonly store$: Store<AppState>,
    private readonly router: Router,
    private readonly dialogService: DialogService
  ) {}

  onDepartmentSelect(id: number, edit: boolean = false): void {
    this.router.navigate([`${RoutingConstants.ROUTE_DEPARTMENTS_DETAILS}/${id}`]);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteDepartment(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_DEPARTMENT_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deleteDepartmentRequested({ id }))
    );
  }
}
