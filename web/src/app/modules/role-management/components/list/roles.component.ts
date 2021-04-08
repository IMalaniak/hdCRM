import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/store';
import { isPrivileged } from '@/core/modules/auth/store/auth.selectors';
import { deleteRoleRequested } from '@/core/modules/role-api/store/role';
import { DialogDataModel } from '@/shared/models';
import { ACTION_LABEL, ROUTING, CONSTANTS, BS_ICON } from '@/shared/constants';
import { ADD_PRIVILEGE, EDIT_PRIVILEGE, DELETE_PRIVILEGE, COLUMN_KEY } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { Column, IColumn, RowActionData, RowActionType } from '@/shared/models/table';
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
  addRoleRoute = ROUTING.ROUTE_ROLES_ADD;
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

  onRowAction(data: RowActionData<RowActionType>): void {
    switch (data.actionType) {
      case RowActionType.DETAILS:
        this.onRoleSelect(data.id, false);
        break;
      case RowActionType.EDIT:
        this.onRoleSelect(data.id, true);
        break;
      case RowActionType.DELETE:
        this.deleteRole(data.id);
        break;
    }
  }

  onRoleSelect(id: number, edit: boolean = false): void {
    this.router.navigateByUrl(`${ROUTING.ROUTE_ROLES_DETAILS}/${id}`);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteRole(id: number): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_ROLE_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deleteRoleRequested({ id }))
    );
  }
}
