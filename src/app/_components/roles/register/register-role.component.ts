import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UsersComponentDialogComponent } from '../../users/users.component';
import { Role, User, Privilege } from '@/_models';
import { RoleService, PrivilegeService, LoaderService } from '@/_services';
import swal from 'sweetalert2';
import { error } from 'util';

@Component({
  selector: 'app-register-role',
  templateUrl: './register-role.component.html',
  styleUrls: ['./register-role.component.scss']
})
export class RegisterRoleComponent implements OnInit {
  role = new Role();
  privileges: Privilege[];

  constructor(
    private router: Router,
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.privilegeService.getFullList().subscribe(privileges => {
      this.privileges = privileges;
    });
  }


  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersComponentDialogComponent, {
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

  onRegisterSubmit() {
    const selectedPrivileges = this.privileges.filter(privilege => privilege.selected);
    if (selectedPrivileges.length > 0) {
      this.role.Privileges = selectedPrivileges.map(privilege => {
        return<Privilege> {
          id: privilege.id
        };
      });
    }

    if (this.role.Users && this.role.Users.length > 0) {
      this.role.Users = this.role.Users.map(user => {
        return<User> {
          id: user.id
        };
      });
    }

    // Register role
    this.roleService.registerRole(this.role).subscribe(
      data => {
        swal({
          title: 'Role added!',
          type: 'success',
          timer: 1500
        });
        this.router.navigate(['/roles']);
      },
      error => {
        swal({
          title: 'Server Error',
          type: 'error',
          timer: 1500
        });
        this.router.navigate(['/register/role']);
      }
    );
  }

}
