import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Role, Privilege } from '../../models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { createRoleRequested } from '../../store/role.actions';
import { User } from '@/modules/users/models';
import { COLUMN_NAMES, COLUMN_LABELS, ACTION_LABELS, CONSTANTS } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogWithTwoButtonModel } from '@/shared/models/modal/dialog-with-two-button.model';
import { ModalDialogResult } from '@/shared/models/modal/modal-dialog-result.model';
import { DialogService } from '@/core/services/dialog';
import { DialogType } from '@/shared/models';
import { DialogSizeService } from '@/shared/services';

@Component({
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRoleComponent implements OnInit {
  role = {} as Role;
  keyString: FormControl;
  columns = COLUMN_NAMES;
  columnLabels = COLUMN_LABELS;
  actionLabels = ACTION_LABELS;
  displayedColumns: COLUMN_NAMES[] = [
    COLUMN_NAMES.TITLE,
    COLUMN_NAMES.VIEW,
    COLUMN_NAMES.ADD,
    COLUMN_NAMES.EDIT,
    COLUMN_NAMES.DELETE
  ];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store$: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private dialogSizeService: DialogSizeService
  ) {}

  ngOnInit(): void {
    this.keyString = new FormControl(null, [Validators.required, Validators.minLength(2)]);
    this.role.Privileges = [];
    this.role.Users = [];
  }

  addParticipantDialog(): void {
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_USERS));

    this.dialogService
      .open(UsersDialogComponent, dialogDataModel)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: ModalDialogResult<User[]>) => {
        if (result && result.result) {
          const selectedUsers: User[] = result.model.filter(
            (selectedUser) => !this.role.Users.some((user) => user.id === selectedUser.id)
          );
          if (selectedUsers?.length) {
            this.role.Users = [...this.role.Users, ...selectedUsers];
            this.cdr.detectChanges();
          }
        }
      });

    // const userC = dialogRef.componentInstance.usersComponent;

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeUntil(this.unsubscribe), skipUntil(userC.loading$), delay(300))
    //   .subscribe(() => {
    //     userC.users
    //       .filter((user) => this.role.Users.some((rUser) => rUser.id === user.id))
    //       ?.forEach((selecteduser) => {
    //         userC.selection.select(selecteduser);
    //       });
    //   });
  }

  removeUser(userId: number): void {
    this.role = { ...this.role, Users: this.role.Users.filter((user) => user.id !== userId) };
  }

  addPrivilegeDialog(): void {
    const dialogDataModel = new DialogDataModel(new DialogWithTwoButtonModel(CONSTANTS.TEXTS_SELECT_PRIVILEGES));

    this.dialogService
      .open(PrivilegesDialogComponent, dialogDataModel, this.dialogSizeService.getSize(DialogType.STANDART))
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: ModalDialogResult<Privilege[]>) => {
        if (result && result.result) {
          const selectedPrivileges: Privilege[] = result.model
            .filter(
              (selectedPrivilege) => !this.role.Privileges.some((privilege) => privilege.id === selectedPrivilege.id)
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
            this.role.Privileges = [...this.role.Privileges, ...selectedPrivileges];
            this.cdr.detectChanges();
          }
        }
      });

    // const privilegesC = dialogRef.componentInstance.privilegesComponent;

    // dialogRef
    //   .afterOpened()
    //   .pipe(takeUntil(this.unsubscribe), skipUntil(privilegesC.isLoading$), delay(300))
    //   .subscribe(() => {
    //     privilegesC.privileges
    //       .filter((privilege) => this.role.Privileges.some((rPrivilege) => rPrivilege.id === privilege.id))
    //       ?.forEach((selectedPrivilege) => {
    //         privilegesC.selection.select(selectedPrivilege);
    //       });
    //   });
  }

  onRegisterSubmit(): void {
    this.role = { ...this.role, keyString: this.keyString.value };
    this.store$.dispatch(createRoleRequested({ role: this.role }));
  }
}
