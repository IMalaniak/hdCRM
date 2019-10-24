import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatTable } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Role, Privilege, RolePrivilege } from '../../_models';
import { RoleService } from '../../_services';
import { UsersDialogComponent } from '@/_modules/users/_components/dialog/users-dialog.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { Observable, Subject } from 'rxjs';
import { MediaqueryService } from '@/_shared/services';
import { takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { Update } from '@ngrx/entity';
import { RoleSaved } from '../../store/role.actions';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy {
  role: Role;
  roleInitial: Role;
  editForm: boolean;
  editRolePrivilege$: Observable<boolean>;
  displayedColumns = ['title', 'view', 'add', 'edit', 'delete'];

  @ViewChild(MatTable, {static: false}) privilegesTable: MatTable<any>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleService,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private mediaQuery: MediaqueryService
  ) {
    this.editForm = false;
  }

  ngOnInit() {
    this.editRolePrivilege$ = this.store.pipe(select(isPrivileged('role-edit')));
    this.editRolePrivilege$.pipe(takeUntil(this.unsubscribe)).subscribe(canEdit => {
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
    this.role = new Role(cloneDeep(this.route.snapshot.data['role']));
    this.roleInitial = new Role(cloneDeep(this.route.snapshot.data['role']));
  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select Users',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.role.Users = [...new Set([...this.role.Users, ...result])];
      }
    });
  }

  addPrivilegeDialog(): void {
    const dialogRef = this.dialog.open(PrivilegesDialogComponent, {
      ...this.mediaQuery.deFaultPopupSize,
      data: {
        title: 'Select privileges',
      }
    });

    const privilegesC = dialogRef.componentInstance.privilegesComponent;

    dialogRef.afterOpened().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      privilegesC.isLoading$.pipe(takeUntil(this.unsubscribe)).subscribe(isLoading => {
        if (!isLoading) {
          for (const pPrivilege of this.role.Privileges) {
            privilegesC.privileges.find((privilege, i) => {
                if (privilege.id === pPrivilege.id) {
                  privilegesC.selection.select(privilege);
                  return true; // stop searching
                }
            });
          }
        }
      });
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe((result: Privilege[]) => {
      result.forEach((el, i) => {
        const tmp = this.role.Privileges.filter(privilege => {
          return privilege.id === el.id;
        });
        if (tmp.length === 0) {
          const newPrivilege = new Privilege(el);
          newPrivilege.RolePrivilege = new RolePrivilege({
            add: false,
            view: false,
            edit: false,
            delete: false
          });
          this.role.Privileges.push(newPrivilege);
        }
      });
      this.privilegesTable.renderRows();
    });
  }

  onUpdateRoleSubmit(): void {
    Swal.fire({
      title: 'You are about to update role',
      text: 'Are You sure You want to update role? Changes cannot be undone.',
      type: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.updateRole();
      }
    });
  }

  updateRole(): void {
    this.roleService.updateRole(this.role).subscribe(
      data => {
        this.roleInitial = new Role(cloneDeep(data));
        this.role = new Role(cloneDeep(data));
        const role: Update<Role> = {
          id: this.role.id,
          changes: new Role(data)
        };
        this.store.dispatch(new RoleSaved({role}));
        this.disableEdit();
        Swal.fire({
          text: 'Role updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        Swal.fire({
          text: 'Server Error',
          type: 'error',
        });
      }
    );
  }

  removePriv(privilegeId: number): void {
    this.role.Privileges = this.role.Privileges.filter(rPriv => {
      return rPriv.id !== privilegeId;
    });
  }

  removeUser(userId: number): void {
    this.role.Users = this.role.Users.filter(rUser => {
      return rUser.id !== userId;
    });
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
