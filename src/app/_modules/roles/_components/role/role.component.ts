import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Role, Privilege } from '../../_models';
import { RoleService, PrivilegeService } from '../../_services';
import { User } from '@/_modules/users/_models';
import { UsersDialogComponent } from '@/_modules/users/_components/dialog/users-dialog.component';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { isPrivileged } from '@/core/auth/store/auth.selectors';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  role: Role;
  roleInitial: Role;
  privileges: Privilege[];
  privilegesInitial: Privilege[];
  editForm: boolean;
  editRolePrivilege$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private privilegeService: PrivilegeService,
    private roleService: RoleService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    this.editForm = false;
  }

  ngOnInit() {
    this.editRolePrivilege$ = this.store.pipe(select(isPrivileged('editRole')));
    this.getRoleData();
  }

  getRoleData(): void {
    this.role = new Role(this.route.snapshot.data['role']);
    this.roleInitial = new Role(this.route.snapshot.data['role']);

  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      height: '80vh',
      data: {
        title: 'Select Users',
      }
    });

    if (this.role.Users) {
      const usersC = dialogRef.componentInstance.usersComponent;

      // TODO
      // dialogRef.afterOpened().subscribe(result => {
      //   this.loaderService.isLoaded.subscribe(isLoaded => {
      //     if (isLoaded) {
      //       for (const roleUser of this.role.Users) {
      //         usersC.sortedData.find((user, i) => {
      //             if (user.id === roleUser.id) {
      //                 usersC.sortedData[i].selected = true;
      //                 return true; // stop searching
      //             }
      //         });
      //       }
      //       usersC.resetSelected(false);
      //     }
      //   });
      // });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.role.Users = result;
      }
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
    this.role.Privileges = this.privileges.filter(privilege => privilege.selected).map(privilege => {
        return<Privilege> {
          id: privilege.id
        };
    });

    this.role.Users = this.role.Users.map(user => {
        return<User> {
          id: user.id
        };
    });

    // Register user
    this.roleService.updateRole(this.role).subscribe(
      role => {
        this.role = role;
        this.roleInitial = { ...this.role };
        this.editForm = false;
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

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.privileges = this.privilegesInitial;
    this.role = this.roleInitial;
  }

}
