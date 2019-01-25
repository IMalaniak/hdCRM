import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { RolesComponentDialogComponent } from '../../roles/roles.component';
import { ValidateService, UserService, PrivilegeService, StateService, TranslationsService } from '@/_services';
import { User, Role, State } from '@/_models';
import { error } from 'util';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  baseUrl: string;
  user: User;
  userInitial: User;
  states: State[];
  editForm: boolean;
  translations: object;
  editUserPrivilege: boolean;
  langs: string[];

  constructor(
    public translationsService: TranslationsService,
    private route: ActivatedRoute,
    private validateService: ValidateService,
    private userService: UserService,
    private stateService: StateService,
    private privilegeService: PrivilegeService,
    private dialog: MatDialog
  ) {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit(): void {
    this.langs = this.translationsService.translate.getLangs();
    this.translationsService.getTranslations([
      'USERCOMPONENT.PopUps.udpateUserTitle',
      'USERCOMPONENT.PopUps.udpateUserText',
      'USERCOMPONENT.PopUps.udpateUserSuccess',
      'USERCOMPONENT.PopUps.udpateUserError',
      'USERCOMPONENT.PopUps.SelectRolesTitle'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });

    this.canEditUser();
    this.getUserData();
    this.editForm = false;
  }

  canEditUser(): void {
    this.editUserPrivilege = this.privilegeService.checkUserPrivilege('editUser');
  }

  getUserData(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.userService.getUser(id).subscribe(user => {
      this.user = user;
      this.userInitial = { ...this.user };

      this.stateService.getStatesList().subscribe(states => {
        this.states = states;
      });

    });

  }

  addRolesDialog(): void {
    const dialogRef = this.dialog.open(RolesComponentDialogComponent, {
      height: '80vh',
      data: {
        title: this.translations['USERCOMPONENT.PopUps.SelectRolesTitle'],
      }
    });

    const rolesC = dialogRef.componentInstance.rolesComponent;

    dialogRef.afterOpen().subscribe(() => {
      rolesC.checkIfDataIsLoaded().then(() => {
        for (const userRole of this.user.Roles) {
          rolesC.roles.find((role, i) => {
              if (role.id === userRole.id) {
                  rolesC.roles[i].selected = true;
                  return true; // stop searching
              }
          });
        }
        rolesC.resetSelected(false);
      });
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.Roles = result;
      }
    });
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.user = this.userInitial;
  }

  onUpdateUserSubmit(): void {
    swal({
      title: this.translations['USERCOMPONENT.PopUps.udpateUserTitle'],
      text: this.translations['USERCOMPONENT.PopUps.udpateUserText'],
      type: 'question',
      showCancelButton: true,
      confirmButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.confirmButtonText'],
      cancelButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.cancelButtonText']
    }).then((result) => {
      if (result.value) {
        this.updateUser();
      }
    });
  }

  updateUser(): void {
    this.user.Roles = this.user.Roles.filter(role => role.selected).map(role => {
        return<Role> {
          id: role.id
        };
    });

    this.userService.updateUser(this.user).subscribe(
      user => {
        this.user = user;
        this.userInitial = { ...this.user };
        this.editForm = false;
        swal({
          text: this.translations['USERCOMPONENT.PopUps.udpateUserSuccess'],
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: this.translations['USERCOMPONENT.PopUps.udpateUserError'],
          type: 'error',
          timer: 3000
        });
      }
    );
  }

}
