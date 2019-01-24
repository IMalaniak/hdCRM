import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UsersComponentDialogComponent } from '@/_components';
import { Role, User, Privilege } from '@/_models';
import { RoleService, PrivilegeService, TranslationsService } from '@/_services';
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
  translations: Object;

  constructor(
    private router: Router,
    private roleService: RoleService,
    private privilegeService: PrivilegeService,
    private translationsService: TranslationsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.translationsService.getTranslations([
      'REGISTERROLECOMPONENT.Alerts.fieldsError',
      'REGISTERROLECOMPONENT.Alerts.roleAdded',
      'REGISTERROLECOMPONENT.PopUps.SelectUsersTitle'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });

    this.privilegeService.getFullList().subscribe(privileges => {
      this.privileges = privileges;
    });
  }


  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersComponentDialogComponent, {
      height: '80vh',
      data: {
        title: this.translations['REGISTERROLECOMPONENT.PopUps.SelectUsersTitle'],
      }
    });

    if (this.role.Users) {
      const usersC = dialogRef.componentInstance.usersComponent;

      dialogRef.afterOpen().subscribe(result => {
        usersC.checkIfDataIsLoaded().then(() => {
          for (const roleUser of this.role.Users) {
            usersC.sortedData.find((user, i) => {
                if (user.id === roleUser.id) {
                    usersC.sortedData[i].selected = true;
                    return true; // stop searching
                }
            });
          }
          usersC.resetSelected(false);
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
          title: this.translations['REGISTERROLECOMPONENT.Alerts.roleAdded'],
          type: 'success',
          timer: 1500
        });
        this.router.navigate(['/roles']);
      },
      error => {
        swal({
          title: this.translationsService.globalTranslations['GLOBAL.PopUps.serverError'],
          type: 'error',
          timer: 1500
        });
        this.router.navigate(['/register/role']);
      }
    );
  }

}
