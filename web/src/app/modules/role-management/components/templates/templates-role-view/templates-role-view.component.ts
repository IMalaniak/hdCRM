import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '@/core/store';
import { User } from '@/core/modules/user-api/shared';
import { Role, Privilege } from '@/core/modules/role-api/shared';
import { TemplatesViewDetailsComponent } from '@/shared/components';
import { MAT_BUTTON, COLUMN_NAMES, COLUMN_LABELS, CONSTANTS, BS_ICONS } from '@/shared/constants';
import { DialogService } from '@/shared/services';
import { DialogDataModel, DialogResultModel, DialogType, DialogWithTwoButtonModel } from '@/shared/models';
import { UsersDialogComponent } from '@/modules/user-management/components';
import { PrivilegesDialogComponent } from '@/modules/role-management/components/privileges/dialog/privileges-dialog.component';

@Component({
  selector: 'templates-role-view',
  templateUrl: './templates-role-view.component.html',
  styleUrls: ['./templates-role-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesRoleViewComponent extends TemplatesViewDetailsComponent<Role> implements OnDestroy {
  matButtonType = MAT_BUTTON;
  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.TITLE,
    COLUMN_NAMES.VIEW,
    COLUMN_NAMES.ADD,
    COLUMN_NAMES.EDIT,
    COLUMN_NAMES.DELETE
  ];
  listIcons: { [key: string]: BS_ICONS } = {
    add: BS_ICONS.Plus,
    delete: BS_ICONS.Trash,
    enabled: BS_ICONS.Check,
    disabled: BS_ICONS.X
  };

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    protected store$: Store<AppState>,
    protected dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {
    super(store$, dialogService);
  }

  addParticipantDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_USERS)
    };

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel, DialogType.MAX)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<User[]>) => {
        if (result && result.success) {
          const selectedUsers: User[] = result.model.filter(
            (selectedUser) => !this.item.Users.some((user) => user.id === selectedUser.id)
          );
          if (selectedUsers?.length) {
            this.item = {
              ...this.item,
              Users: [...this.item.Users, ...selectedUsers]
            };
            this.cdr.detectChanges();
          }
        }
      });

    // TODO: @ArsenIrod add afterOpened logic
  }

  addPrivilegeDialog(): void {
    const dialogDataModel: DialogDataModel<DialogWithTwoButtonModel> = {
      dialogModel: new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PRIVILEGES)
    };

    this.dialogService
      .open(PrivilegesDialogComponent, dialogDataModel, DialogType.STANDART)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<Privilege[]>) => {
        if (result && result.success) {
          const selectedPrivileges: Privilege[] = result.model
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
    this.isEditing.emit(true);
    this.displayedColumns = [...this.displayedColumns, COLUMN_NAMES.ACTIONS];
  }

  onClickCancelEdit(): void {
    this.isEditing.emit(false);
    this.disableEdit();
  }

  save(): void {
    this.saveChanges.emit({ ...this.item, ...this.formValues });
    this.disableEdit();
  }

  disableEdit(): void {
    this.displayedColumns = this.displayedColumns.filter((col) => col !== COLUMN_NAMES.ACTIONS);
  }

  cardTitle(): string {
    return this.isCreatePage ? CONSTANTS.TEXTS_CREATE_ROLE : this.item.keyString;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
