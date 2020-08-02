import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Role, Privilege, RolePrivilege } from '../../models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { MediaqueryService } from '@/shared';
import { Subject } from 'rxjs';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { createRole } from '../../store/role.actions';
import { User } from '@/modules/users/models';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  keyString: FormControl;
  role = {} as Role;
  displayedColumns = ['title', 'view', 'add', 'edit', 'delete'];

  @ViewChild(MatTable) privilegesTable: MatTable<any>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store: Store<AppState>, private dialog: MatDialog, private mediaQuery: MediaqueryService) {}

  ngOnInit() {
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
          .filter(user => this.role.Users.some(rUser => rUser.id === user.id))
          ?.forEach(selecteduser => {
            userC.selection.select(selecteduser);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedUsers: User[] = result?.filter(
          selectedUser => !this.role.Users.some(user => user.id === selectedUser.id)
        );

        if (selectedUsers?.length) {
          this.role.Users = [...this.role.Users, ...selectedUsers];
        }
      });
  }

  removeUser(id: number): void {
    // TODO: @ArseniiIrod, @IMalaniak add logic to remove user
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
          .filter(privilege => this.role.Privileges.some(rPrivilege => rPrivilege.id === privilege.id))
          ?.forEach(selectedPrivilege => {
            privilegesC.selection.select(selectedPrivilege);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: Privilege[]) => {
        result.forEach((el: Privilege, i) => {
          const tmp = this.role.Privileges.filter(privilege => {
            return privilege.id === el.id;
          });
          if (tmp.length === 0) {
            const newPrivilege = el;
            newPrivilege.RolePrivilege = {
              add: false,
              view: false,
              edit: false,
              delete: false
            } as RolePrivilege;
            this.role.Privileges.push(newPrivilege);
          }
        });
        this.privilegesTable.renderRows();
      });
  }

  onRegisterSubmit() {
    this.role = { ...this.role, keyString: this.keyString.value };
    this.store.dispatch(createRole({ role: this.role }));
  }
}
