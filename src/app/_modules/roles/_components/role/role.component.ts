import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Role } from '../../_models';
import { RoleService } from '../../_services';
import { User } from '@/_modules/users';
import { UsersDialogComponent } from '@/_modules/users/_components/dialog/users-dialog.component';
import { Privilege } from '@/core/_models';
import { AuthenticationService, LoaderService, PrivilegeService } from '@/_shared/services';



@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  baseUrl: string;
  role: Role;
  roleInitial: Role;
  privileges: Privilege[];
  privilegesInitial: Privilege[];
  editForm: boolean;
  editRolePrivilege: boolean;
  showDataLoader: boolean;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private privilegeService: PrivilegeService,
    private roleService: RoleService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {
    this.baseUrl = environment.baseUrl;
    this.editForm = false;
    this.showDataLoader = true;
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.editRolePrivilege = this.privilegeService.isPrivileged(user, 'editRole');
    });
    this.getRoleData();
  }

  getRoleData(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.roleService.getRole(id).subscribe(role => {
      this.role = role;
      this.roleInitial = { ...this.role };

      this.privilegeService.getPrivilegesListForRole(id).subscribe(privileges => {
        this.privileges = privileges;
        this.privilegesInitial = [ ...this.privileges ];
      });
    });
  }

  addParticipantDialog(): void {
    this.showDataLoader = false;
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      height: '80vh',
      data: {
        title: 'Select Users',
      }
    });

    if (this.role.Users) {
      const usersC = dialogRef.componentInstance.usersComponent;

      dialogRef.afterOpened().subscribe(result => {
        this.loaderService.isLoaded.subscribe(isLoaded => {
          if (isLoaded) {
            for (const roleUser of this.role.Users) {
              usersC.sortedData.find((user, i) => {
                  if (user.id === roleUser.id) {
                      usersC.sortedData[i].selected = true;
                      return true; // stop searching
                  }
              });
            }
            usersC.resetSelected(false);
          }
        });
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.role.Users = result;
      }
    });
  }

  onUpdateRoleSubmit(): void {
    swal({
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
        swal({
          text: 'Role updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
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
