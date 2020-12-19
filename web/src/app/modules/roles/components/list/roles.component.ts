import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { RolesDataSource } from '../../services/role.datasource';
import { DialogDataModel } from '@/shared/models';
import { selectRolesTotalCount, selectRolesPageLoading } from '../../store/role.selectors';
import { RoutingConstants, CONSTANTS, BS_ICONS, ACTION_LABELS } from '@/shared/constants';
import { deleteRoleRequested, changeIsEditingState } from '../../store/role.actions';
import { ADD_PRIVILEGES, EDIT_PRIVILEGES, DELETE_PRIVILEGES, COLUMN_NAMES } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { DataColumn } from '@/shared/models/table/data-column.model';

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
  canAddRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.ROLE)));
  canEditRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(EDIT_PRIVILEGES.ROLE)));
  canDeleteRole$: Observable<boolean> = this.store$.pipe(select(isPrivileged(DELETE_PRIVILEGES.ROLE)));

  actionLabels = ACTION_LABELS;
  addRoleRoute = RoutingConstants.ROUTE_ROLES_ADD;
  listIcons: { [key: string]: BS_ICONS } = {
    matMenu: BS_ICONS.ThreeDotsVertical,
    add: BS_ICONS.Plus,
    info: BS_ICONS.InfoSquare,
    edit: BS_ICONS.Pencil,
    delete: BS_ICONS.Trash
  };

  displayedColumns: DataColumn[] = [
    DataColumn.createSequenceNumberColumn(),
    DataColumn.createColumn({ title: COLUMN_NAMES.TITLE }),
    DataColumn.createColumn({ title: COLUMN_NAMES.USERS }),
    DataColumn.createColumn({ title: COLUMN_NAMES.PRIVILEGES }),
    DataColumn.createColumn({ title: COLUMN_NAMES.CREATED_AT }),
    DataColumn.createColumn({ title: COLUMN_NAMES.UPDATED_AT }),
    DataColumn.createActionsColumn()
  ];

  constructor(
    private readonly store$: Store<AppState>,
    private readonly router: Router,
    private readonly dialogService: DialogService
  ) {}

  onRoleSelect(id: number, edit: boolean = false): void {
    this.router.navigateByUrl(`${RoutingConstants.ROUTE_ROLES_DETAILS}/${id}`);
    this.store$.dispatch(changeIsEditingState({ isEditing: edit }));
  }

  deleteRole(id: number): void {
    // TODO: add to html
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_ROLE_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () =>
      this.store$.dispatch(deleteRoleRequested({ id }))
    );
  }
}
