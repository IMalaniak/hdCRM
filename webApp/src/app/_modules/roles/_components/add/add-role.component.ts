import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialog, MatTable } from '@angular/material';
import { Router } from '@angular/router';
import { Role, Privilege, RolePrivilege } from '../../_models';
import { RoleService, PrivilegeService } from '../../_services';
import { User } from '@/_modules/users/_models';
import { UsersDialogComponent } from '@/_modules/users/_components/dialog/users-dialog.component';
import Swal from 'sweetalert2';
import { MediaqueryService } from '@/_shared/services';
import { Subject } from 'rxjs';
import { PrivilegesDialogComponent } from '../privileges/dialog/privileges-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '@/core/reducers';
import { Store } from '@ngrx/store';
import { CreateRole } from '../../store/role.actions';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  keyString: FormControl;
  role = new Role();
  displayedColumns = ['title', 'view', 'add', 'edit', 'delete'];

  @ViewChild(MatTable, { static: false }) privilegesTable: MatTable<any>;

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

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: Privilege[]) => {
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

  onRegisterSubmit() {
    this.role.keyString = this.keyString.value;
    this.store.dispatch(new CreateRole({ role: this.role }));
  }
}
