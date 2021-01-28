import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { Role, Privilege } from '@/core/modules/role-api/shared';
import { selectRolesLoading } from '@/core/modules/role-api/store/role';
import { selectUsersById } from '@/core/modules/user-api/store';
import { TemplatesViewDetailsComponent } from '@/shared/components';
import { MAT_BUTTON, COLUMN_KEYS, COLUMN_LABELS, CONSTANTS, BS_ICONS, FORMCONSTANTS } from '@/shared/constants';
import { DialogService } from '@/shared/services';
import { DialogDataModel, IDialogResult, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { UsersDialogComponent } from '@/modules/user-management/components';
import { PrivilegesDialogComponent } from '@/modules/role-management/components/privileges/dialog/privileges-dialog.component';
import { resetSelectionPopup, prepareSelectionPopup } from '@/modules/user-management/store';

@Component({
  selector: 'templates-role-view',
  templateUrl: './templates-role-view.component.html',
  styleUrls: ['./templates-role-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesRoleViewComponent extends TemplatesViewDetailsComponent<Role> {
  isLoading$: Observable<boolean> = this.store$.pipe(select(selectRolesLoading));

  matButtonType = MAT_BUTTON;
  columns = COLUMN_KEYS;
  columnLabels = COLUMN_LABELS;
  displayedColumns: COLUMN_KEYS[] = [
    COLUMN_KEYS.TITLE,
    COLUMN_KEYS.VIEW,
    COLUMN_KEYS.ADD,
    COLUMN_KEYS.EDIT,
    COLUMN_KEYS.DELETE
  ];
  listIcons: { [key: string]: BS_ICONS } = {
    add: BS_ICONS.Plus,
    delete: BS_ICONS.Trash,
    enabled: BS_ICONS.Check,
    disabled: BS_ICONS.X
  };
  protected readonly formName = FORMCONSTANTS.ROLE;

  constructor(
    protected readonly store$: Store<AppState>,
    protected readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(store$, dialogService);
  }

  addParticipantDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_USERS)
    };
    this.store$.dispatch(prepareSelectionPopup({ selectedUsersIds: this.item.Users.map((user) => user.id) }));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: IDialogResult<number[]>) => {
        if (result && result.success) {
          const selectedUsersIds: number[] = result.data?.filter(
            (selectedUserId) => !this.item.Users.some((user) => user.id === selectedUserId)
          );
          if (selectedUsersIds?.length) {
            this.store$.pipe(select(selectUsersById(selectedUsersIds)), first()).subscribe((selectedUsers) => {
              this.item = {
                ...this.item,
                Users: [...this.item.Users, ...selectedUsers]
              };
              this.store$.dispatch(resetSelectionPopup());
              this.cdr.detectChanges();
            });
          }
        }
      });
  }

  addPrivilegeDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PRIVILEGES)
    };

    this.dialogService
      .open(PrivilegesDialogComponent, dialogDataModel, DialogType.STANDART)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: IDialogResult<Privilege[]>) => {
        if (result && result.success) {
          const selectedPrivileges: Privilege[] = result.data
            .filter(
              (selectedPrivilege) => !this.item.Privileges.some((privilege) => privilege.id === selectedPrivilege.id)
            )
            ?.map((selectedPrivilege) => {
              return {
                ...selectedPrivilege,
                RolePrivilege: {
                  add: false,
                  view: false,
                  edit: false,
                  delete: false
                }
              };
            });
          if (selectedPrivileges?.length) {
            this.item = {
              ...this.item,
              Privileges: [...this.item.Privileges, ...selectedPrivileges]
            };
            this.cdr.detectChanges();
          }
        }
      });

    // TODO: @ArsenIrod add afterOpened logic
  }

  removePrivilege(privilegeId: number): void {
    this.item = { ...this.item, Privileges: this.item.Privileges.filter((privilege) => privilege.id !== privilegeId) };
  }

  removeUser(userId: number): void {
    this.item = { ...this.item, Users: this.item.Users.filter((user) => user.id !== userId) };
  }

  onClickEdit(): void {
    super.onClickEdit();
    this.displayedColumns = [...this.displayedColumns, COLUMN_KEYS.ACTIONS];
  }

  onClickCancelEdit(): void {
    super.onClickCancelEdit();
    this.disableEdit();
  }

  save(): void {
    super.save();
    this.disableEdit();
  }

  disableEdit(): void {
    this.displayedColumns = this.displayedColumns.filter((col) => col !== COLUMN_KEYS.ACTIONS);
  }

  cardTitle(): string {
    return this.isCreatePage ? CONSTANTS.TEXTS_CREATE_ROLE : this.item.keyString;
  }
}
