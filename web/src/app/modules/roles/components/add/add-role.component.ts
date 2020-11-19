import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { DynamicForm } from '@/shared/models';
import { COLUMN_NAMES, COLUMN_LABELS, ACTION_LABELS, RoutingDataConstants, CONSTANTS } from '@/shared/constants';
import { User } from '@/modules/users/models';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogWithTwoButtonModel } from '@/shared/models/dialog/dialog-with-two-button.model';
import { DialogResultModel } from '@/shared/models/dialog/dialog-result.model';
import { DialogType } from '@/shared/models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { Role, Privilege } from '../../models';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { createRoleRequested } from '../../store/role.actions';
import { DialogService } from '@/shared/services';

@Component({
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRoleComponent implements OnInit {
  role = {} as Role;
  roleFormJson: DynamicForm;
  roleFormValues: Role;

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
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.roleFormJson = this.route.snapshot.data[RoutingDataConstants.FORM_JSON];
    this.role.Privileges = [];
    this.role.Users = [];
  }

  roleFormValueChanges(formVal: Role): void {
    this.roleFormValues = { ...this.roleFormValues, ...formVal };
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
    this.store$.dispatch(createRoleRequested({ role: { ...this.role, ...this.roleFormValues } }));
  }
}
