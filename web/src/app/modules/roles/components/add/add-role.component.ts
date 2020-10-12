import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { Store } from '@ngrx/store';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';

import { AppState } from '@/core/reducers';
import { DynamicForm } from '@/shared/models';
import { MediaqueryService } from '@/shared/services';
import { COLUMN_NAMES, COLUMN_LABELS, ACTION_LABELS, RoutingDataConstants } from '@/shared/constants';
import { User } from '@/modules/users/models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { Role, Privilege } from '../../models';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { createRoleRequested } from '../../store/role.actions';

@Component({
  selector: 'app-add-role',
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
    private route: ActivatedRoute,
    private store$: Store<AppState>,
    private dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
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
          .filter((user) => this.role.Users.some((rUser) => rUser.id === user.id))
          ?.forEach((selecteduser) => {
            userC.selection.select(selecteduser);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedUsers: User[] = result?.filter(
          (selectedUser) => !this.role.Users.some((user) => user.id === selectedUser.id)
        );

        if (selectedUsers?.length) {
          this.role.Users = [...this.role.Users, ...selectedUsers];
          this.cdr.detectChanges();
        }
      });
  }

  removeUser(userId: number): void {
    this.role = { ...this.role, Users: this.role.Users.filter((user) => user.id !== userId) };
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
          .filter((privilege) => this.role.Privileges.some((rPrivilege) => rPrivilege.id === privilege.id))
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
      });
  }

  onRegisterSubmit(): void {
    this.store$.dispatch(createRoleRequested({ role: { ...this.role, ...this.roleFormValues } }));
  }
}
