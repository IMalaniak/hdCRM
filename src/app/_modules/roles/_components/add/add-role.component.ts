import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Role, Privilege } from '../../_models';
import { RoleService, PrivilegeService } from '../../_services';
import { User } from '@/_modules/users/_models';
import { UsersDialogComponent } from '@/_modules/users/_components/dialog/users-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  keyString: FormControl;
  role = new Role();
  privileges: Privilege[];

  constructor(
    private router: Router,
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.privilegeService.getFullList().subscribe(privileges => {
      this.privileges = privileges;
    });

    this.keyString = new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]);
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

      // TODO:
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

  onRegisterSubmit() {
    this.role.keyString = this.keyString.value;
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
        Swal.fire({
          title: 'Role added!',
          type: 'success',
          timer: 1500
        });
        this.router.navigate(['/roles']);
      },
      error => {
        Swal.fire({
          title: 'Server Error',
          type: 'error',
          timer: 1500
        });
      }
    );
  }

}
