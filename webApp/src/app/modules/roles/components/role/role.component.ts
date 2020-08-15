import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Role, Privilege } from '../../models';
import { UsersDialogComponent } from '@/modules/users/components/dialog/users-dialog.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { Observable, Subject } from 'rxjs';
import { MediaqueryService, ToastMessageService } from '@/shared';
import { takeUntil, skipUntil, delay } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { Update } from '@ngrx/entity';
import { roleSaved } from '../../store/role.actions';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { RoleService } from '../../services';
import { User } from '@/modules/users';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent implements OnInit, OnDestroy {
  canEditRolePrivilege$: Observable<boolean> = this.store.pipe(select(isPrivileged('role-edit')));

  role: Role;
  roleInitial: Role;
  editForm = false;
  displayedColumns: string[] = ['title', 'view', 'add', 'edit', 'delete'];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService,
    private cdr: ChangeDetectorRef,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.canEditRolePrivilege$.pipe(takeUntil(this.unsubscribe)).subscribe(canEdit => {
      if (canEdit) {
        const edit = this.route.snapshot.queryParams['edit'];
        if (edit) {
          this.editForm = JSON.parse(edit);
        }
      }
    });

    this.getRoleData();
  }

  getRoleData(): void {
    this.role = cloneDeep(this.route.snapshot.data['role']);
    this.roleInitial = cloneDeep(this.route.snapshot.data['role']);
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
          ?.forEach(selectedParticipant => {
            userC.selection.select(selectedParticipant);
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
          .filter(privilege => this.role.Privileges.some(rPrivilege => rPrivilege.id === privilege.id))
          ?.forEach(selectedPrivilege => {
            privilegesC.selection.select(selectedPrivilege);
          });
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: Privilege[]) => {
        const selectedPrivileges: Privilege[] = result
          ?.filter(
            selectedPrivilege => !this.role.Privileges.some(rPrivilege => rPrivilege.id === selectedPrivilege.id)
          )
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

  onUpdateRoleSubmit(): void {
    this.toastMessageService
      .confirm('You are about to update role', 'Are You sure You want to update role? Changes cannot be undone.')
      .then(result => {
        if (result.value) {
          this.updateRole();
        }
      });
  }

  updateRole(): void {
    this.roleService.updateRole(this.role).subscribe(
      data => {
        this.roleInitial = cloneDeep(data);
        this.role = cloneDeep(data);
        const role: Update<Role> = {
          id: this.role.id,
          changes: data
        };
        this.store.dispatch(roleSaved({ role }));
        this.disableEdit();
        this.toastMessageService.toast('Role updated!');
      },
      error => {
        this.toastMessageService.popup('Server Error!', 'error');
      }
    );
  }

  removePrivilege(privilegeId: number): void {
    this.role = { ...this.role, Privileges: this.role.Privileges.filter(privilege => privilege.id !== privilegeId) };
  }

  removeUser(userId: number): void {
    this.role = { ...this.role, Users: this.role.Users.filter(user => user.id !== userId) };
  }

  onClickEdit(): void {
    this.editForm = true;
    this.displayedColumns.push('actions');
  }

  disableEdit(): void {
    this.editForm = false;
    this.displayedColumns = this.displayedColumns.filter(col => {
      return col !== 'actions';
    });
  }

  onClickCancelEdit(): void {
    this.role = cloneDeep(this.roleInitial);
    this.disableEdit();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
