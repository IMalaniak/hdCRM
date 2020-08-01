import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Role, Privilege } from '../../models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { MediaqueryService } from '@/shared';
import { Subject } from 'rxjs';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { createRole } from '../../store/role.actions';
import { User } from '@/modules/users/models';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRoleComponent implements OnInit {
  keyString: FormControl;
  role = {} as Role;
  displayedColumns = ['title', 'view', 'add', 'edit', 'delete'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef
  ) {}

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

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: User[]) => {
        const selectedUsers: User[] = result?.filter(
          selectedUser => !this.role.Users.some(user => user.id === selectedUser.id)
        );

        if (selectedUsers?.length) {
          this.role.Users = [...this.role.Users, ...selectedUsers];
          this.cdr.detectChanges();
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
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        privilegesC.isLoading$.pipe(takeUntil(this.unsubscribe)).subscribe(isLoading => {
          if (!isLoading) {
            for (const pPrivilege of this.role.Privileges) {
              privilegesC.privileges.find(privilege => {
                if (privilege.id === pPrivilege.id) {
                  privilegesC.selection.select(privilege);
                  return true; // stop searching
                }
              });
            }
          }
        });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: Privilege[]) => {
        const selectedPrivileges: Privilege[] = result
          ?.filter(selectedPrivilege => !this.role.Privileges.some(privilege => privilege.id === selectedPrivilege.id))
          ?.map(selectedPrivilege => {
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

  onRegisterSubmit() {
    this.role = { ...this.role, keyString: this.keyString.value };
    this.store.dispatch(createRole({ role: this.role }));
  }
}
