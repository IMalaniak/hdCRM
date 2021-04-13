import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '@/core/store';
import { Role, Privilege } from '@/core/modules/role-api/shared';
import { selectRolesLoading } from '@/core/modules/role-api/store/role';
import { selectUsersById } from '@/core/modules/user-api/store';
import { TemplatesViewDetailsComponent } from '@/shared/components';
import { MAT_BUTTON, COLUMN_KEY, COLUMN_LABEL, CommonConstants, BS_ICON, FormNameConstants } from '@/shared/constants';
import { DialogService } from '@/shared/services';
import { DialogDataModel, IDialogResult, DIALOG_TYPE, DialogWithTwoButtonModel } from '@/shared/models';
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
  columns = COLUMN_KEY;
  columnLabels = COLUMN_LABEL;
  displayedColumns: COLUMN_KEY[] = [
    COLUMN_KEY.TITLE,
    COLUMN_KEY.VIEW,
    COLUMN_KEY.ADD,
    COLUMN_KEY.EDIT,
    COLUMN_KEY.DELETE
  ];
  listIcons: { [key: string]: BS_ICON } = {
    add: BS_ICON.Plus,
    delete: BS_ICON.Trash,
    enabled: BS_ICON.Check,
    disabled: BS_ICON.X
  };
  protected readonly formName = FormNameConstants.ROLE;

  constructor(
    protected readonly store$: Store<AppState>,
    protected readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(store$, dialogService);
  }

  addUserDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel()
    };
    this.store$.dispatch(prepareSelectionPopup({ selectedUsersIds: this.item.Users.map((user) => user.id) }));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DIALOG_TYPE.MAX)
      .afterClosed()
      .subscribe((result: IDialogResult<number[]>) => {
        if (result?.success) {
          const selectedUsersIds: number[] = result.data?.filter(
            (selectedUserId) => !this.item.Users.some((user) => user.id === selectedUserId)
          );
          if (selectedUsersIds?.length) {
            this.store$.pipe(select(selectUsersById(selectedUsersIds)), first()).subscribe((selectedUsers) => {
              this.item = {
                ...this.item,
                Users: [...this.item.Users, ...selectedUsers]
              };
              this.cdr.detectChanges();
            });
          }
        }
        this.store$.dispatch(resetSelectionPopup());
      });
  }

  addPrivilegeDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CommonConstants.TEXTS_SELECT_PRIVILEGES)
    };

    this.dialogService
      .open(PrivilegesDialogComponent, dialogDataModel, DIALOG_TYPE.STANDART)
      .afterClosed()
      .subscribe((result: IDialogResult<Privilege[]>) => {
        if (result?.success) {
          const selectedPrivileges: Privilege[] = result.data
            .filter(
              (selectedPrivilege) => !this.item.Privileges.some((privilege) => privilege.id === selectedPrivilege.id)
            )
            ?.map((selectedPrivilege) => ({
                ...selectedPrivilege,
                RolePrivilege: {
                  add: false,
                  view: false,
                  edit: false,
                  delete: false
                }
              }));
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
    this.displayedColumns = [...this.displayedColumns, COLUMN_KEY.ACTIONS];
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
    this.displayedColumns = this.displayedColumns.filter((col) => col !== COLUMN_KEY.ACTIONS);
  }

  cardTitle(): string {
    return this.isCreatePage ? CommonConstants.TEXTS_CREATE_ROLE : this.item.keyString;
  }
}
