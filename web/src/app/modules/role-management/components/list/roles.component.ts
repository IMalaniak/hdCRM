import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { isPrivileged } from '@core/modules/auth/store/auth.selectors';
import { deleteRoleRequested } from '@core/modules/role-api/store/role';
import { AppState } from '@core/store';
import { DialogConfirmComponent } from '@shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { ACTION_LABEL, RoutingConstants, CommonConstants, BS_ICON } from '@shared/constants';
import { ADD_PRIVILEGE, EDIT_PRIVILEGE, DELETE_PRIVILEGE, COLUMN_KEY } from '@shared/constants';
import { DialogDataModel } from '@shared/models';
import { DialogConfirmModel } from '@shared/models/dialog/dialog-confirm.model';
import { Column, IColumn, RowActionData, ROW_ACTION_TYPE } from '@shared/models/table';
import { DialogService } from '@shared/services';

import { RolesDataSource } from '../../dataSources/role.datasource';
import { changeIsEditingState, selectRolesPageLoading, selectRolesTotalCount } from '../../store';

@Component({
  selector: 'roles-component',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent {
  dataSource: RolesDataSource = new RolesDataSource(this.store$);
  loading$: Observable<boolean> = this.store$.pipe(select(selectRolesPageLoading));
  resultsLength$: Observable<number> = this.store$.pipe(select(selectRolesTotalCount));
  canAddRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGE.ROLE)));
  canEditRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGE.ROLE)));
  canDeleteRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGE.ROLE)));

  actionLabels = ACTION_LABEL;
  addRoleRoute = RoutingConstants.ROUTE_ROLES_ADD;
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
    Column.createColumn({ key: COLUMN_KEY.USERS, hasSorting: false }),
    Column.createColumn({ key: COLUMN_KEY.PRIVILEGES, hasSorting: false }),
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
        this.onRoleSelect(data.id, false);
        break;
      case ROW_ACTION_TYPE.EDIT:
        this.onRoleSelect(data.id, true);
        break;
      case ROW_ACTION_TYPE.DELETE:
        this.deleteRole(data.id);
        break;
    }
  }

  onRoleSelect(id: number, edit: boolean = false): void {
    this.router.navigateByUrl(`${RoutingConstants.ROUTE_ROLES_DETAILS}/${id}`);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteRole(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CommonConstants.TEXTS_DELETE_ROLE_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deleteRoleRequested({ id }))
    );
  }
}
