import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Role, Privilege } from '../../models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { MediaqueryService } from '@/shared';
import { Subject } from 'rxjs';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { createRoleRequested } from '../../store/role.actions';
import { User } from '@/modules/users/models';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRoleComponent implements OnInit {
  role = {} as Role;
  keyString: FormControl;
  displayedColumns: string[] = ['title', 'view', 'add', 'edit', 'delete'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.keyString = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.role.Privileges = [];
    this.role.Users = [];
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
    this.role = { ...this.role, keyString: this.keyString.value };
    this.store.dispatch(createRoleRequested({ role: this.role }));
  }
}
