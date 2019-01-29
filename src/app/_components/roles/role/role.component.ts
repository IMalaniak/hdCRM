import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { UsersComponentDialogComponent } from '../../users/users.component';
import swal from 'sweetalert2';
import { Role, User, Privilege } from '@/_models';
import { AuthenticationService, RoleService, PrivilegeService, TranslationsService } from '@/_services';
import { error } from '@angular/compiler/src/util';

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
  translations: object;
  editRolePrivilege: boolean;

  constructor(
    private translationsService: TranslationsService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private privilegeService: PrivilegeService,
    private roleService: RoleService,
    private dialog: MatDialog
  ) {
    this.baseUrl = environment.baseUrl;
    this.editForm = false;
  }

  ngOnInit() {
    this.translationsService.getTranslations([
      'ROLECOMPONENT.PopUps.udpateRoleTitle',
      'ROLECOMPONENT.PopUps.udpateRoleText',
      'ROLECOMPONENT.PopUps.udpateRoleSuccess',
      'ROLECOMPONENT.PopUps.udpateRoleError',
      'ROLECOMPONENT.PopUps.SelectUsersTitle'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });
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
    const dialogRef = this.dialog.open(UsersComponentDialogComponent, {
      height: '80vh',
      data: {
        title: this.translations['ROLECOMPONENT.PopUps.SelectUsersTitle'],
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

  onUpdateRoleSubmit(): void {
    swal({
      title: this.translations['ROLECOMPONENT.PopUps.udpateRoleTitle'],
      text: this.translations['ROLECOMPONENT.PopUps.udpateRoleText'],
      type: 'question',
      showCancelButton: true,
      confirmButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.confirmButtonText'],
      cancelButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.cancelButtonText']
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
          text: this.translations['ROLECOMPONENT.PopUps.udpateRoleSuccess'],
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: this.translations['ROLECOMPONENT.PopUps.udpateRoleError'],
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
