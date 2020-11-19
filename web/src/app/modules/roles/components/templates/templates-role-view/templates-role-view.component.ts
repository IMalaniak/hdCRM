import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';

import { AppState } from '@/core/reducers';
import { TemplatesViewDetailsComponent } from '@/shared/components';
import { MAT_BUTTON, COLUMN_NAMES, COLUMN_LABELS, CONSTANTS } from '@/shared/constants';
import { MediaqueryService, ToastMessageService } from '@/shared/services';
import { Privilege, Role } from '@/modules/roles/models';
import { UsersDialogComponent, User } from '@/modules/users';
import { PrivilegesDialogComponent } from '@/modules/roles/components/privileges/dialog/privileges-dialog.component';

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

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    protected store$: Store<AppState>,
    protected toastMessageService: ToastMessageService,
    private dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {
    super(store$, toastMessageService);
  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select Users'
      }
    });

    const userC = dialogRef.componentInstance.usersComponent;

    dialogRef
      .afterOpened()
      .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$), delay(300))
      .subscribe(() => {
        userC.users
          .filter((user) => this.item.Users.some((rUser) => rUser.id === user.id))
          ?.forEach((selectedParticipant) => {
            userC.selection.select(selectedParticipant);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedUsers: User[] = result?.filter(
          (selectedUser) => !this.item.Users.some((user) => user.id === selectedUser.id)
        );

        if (selectedUsers?.length) {
          this.item.Users = [...this.item.Users, ...selectedUsers];
          this.cdr.detectChanges();
        }
      });
  }

  addPrivilegeDialog(): void {
    const dialogRef = this.dialog.open(PrivilegesDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select privileges'
      }
    });

    const privilegesC = dialogRef.componentInstance.privilegesComponent;

    dialogRef
      .afterOpened()
      .pipe(takeUntil(this.unsubscribe), skipUntil(privilegesC.isLoading$), delay(300))
      .subscribe(() => {
        privilegesC.privileges
          .filter((privilege) => this.item.Privileges.some((rPrivilege) => rPrivilege.id === privilege.id))
          ?.forEach((selectedPrivilege) => {
            privilegesC.selection.select(selectedPrivilege);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: Privilege[]) => {
        const selectedPrivileges: Privilege[] = result
          ?.filter(
            (selectedPrivilege) => !this.item.Privileges.some((rPrivilege) => rPrivilege.id === selectedPrivilege.id)
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
          this.item.Privileges = [...this.item.Privileges, ...selectedPrivileges];
          this.cdr.detectChanges();
        }
      });
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
