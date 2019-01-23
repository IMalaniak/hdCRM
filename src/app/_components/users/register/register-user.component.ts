import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ValidateService, UserService, RoleService, TranslationsService } from '@/_services';
import { User, Role } from '@/_models';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  user = new User();
  roles: Role[];
  translations: Object;
  langs: string[];

  constructor(
    private validateService: ValidateService,
    private userService: UserService,
    private router: Router,
    private roleService: RoleService,
    public translationsService: TranslationsService
  ) { }

  ngOnInit() {
    this.langs = this.translationsService.translate.getLangs();
    this.translationsService.getTranslations([
      'REGISTERUSERCOMPONENT.Alerts.fieldsError',
      'REGISTERUSERCOMPONENT.Alerts.badEmail',
      'REGISTERUSERCOMPONENT.Alerts.userRegistered'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });

    this.roleService.getRolesList().subscribe(roles => {
      this.roles = roles;
    });
  }

  onRegisterSubmit() {
    // Required fields
    if (!this.validateService.validateRegister(this.user)) {
      swal({
        title: this.translations['REGISTERUSERCOMPONENT.Alerts.fieldsError'],
        type: 'warning',
        timer: 1500
      });
      return false;
    }

    // validateEmail
    if (!this.validateService.validateEmail(this.user.email)) {
      swal({
        title: this.translations['REGISTERUSERCOMPONENT.Alerts.badEmail'],
        type: 'warning',
        timer: 1500
      });
      return false;
    }

    this.user.Roles = this.roles.filter(role => role.selected).map(role => {
        return<Role> {
          id: role.id
        };
    });

    // Register user
    this.userService.registerUser(this.user).subscribe(
      data => {
        swal({
          title: this.translations['REGISTERUSERCOMPONENT.Alerts.userRegistered'],
          type: 'success',
          timer: 1500
        });
        this.router.navigate(['/login']);
      },
      error => {
        swal({
          title: this.translationsService.globalTranslations['GLOBAL.PopUps.serverError'],
          type: 'error',
          timer: 1500
        });
        this.router.navigate(['/register/user']);
      }
    );
  }

}
