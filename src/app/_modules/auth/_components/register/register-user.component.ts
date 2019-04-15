import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import swal from 'sweetalert2';
import { AuthenticationService } from '@/_shared/services';
// import { RoleService } from '@/_modules/roles/_services';
// import { Role } from '@/_modules/roles';
// import { Response } from '@/core/_models';
import { User } from '@/_modules/users';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  user: User;
  // roles: Role[];
  langs: string[];
  userData: FormGroup;
  hidePassword = true;
  selectedRolesIds: number[];

  constructor(
    private authService: AuthenticationService,
    // private roleService: RoleService,
    private _formBuilder: FormBuilder
  ) {
    this.user = new User();
  }

  ngOnInit() {
    // this.roleService.getFullList().subscribe(roles => {
    //   this.roles = roles;
    // });

    this.userData = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          login: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
          ]),
          email: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
          ]),
          // password: new FormControl('', [
          //   Validators.required,
          //   Validators.minLength(6)
          // ]),
        }),
        this._formBuilder.group({
          name: new FormControl('', [
            Validators.required,
            Validators.maxLength(25)
          ]),
          surname: new FormControl('', [
            Validators.required,
            Validators.maxLength(25)
          ]),
          phone: new FormControl('', [
            Validators.required,
            Validators.pattern('^[0-9]+$')
          ]),
          // defaultLang: new FormControl('en', Validators.required)
        }),
      ])
    });
  }

  // onRoleSelect(list) {
  //   this.selectedRolesIds = list.selectedOptions.selected.map(item => item.value);
  // }

  get formArray(): AbstractControl | null { return this.userData.get('formArray'); }
  get login() { return this.formArray.get([0]).get('login'); }
  // get password() { return this.formArray.get([0]).get('password'); }
  get email() { return this.formArray.get([0]).get('email'); }
  get name() { return this.formArray.get([1]).get('name'); }
  get surname() { return this.formArray.get([1]).get('surname'); }
  get phone() { return this.formArray.get([1]).get('phone'); }
  // get defaultLang() { return this.formArray.get([1]).get('defaultLang'); }

  onRegisterSubmit() {
    this.user.login = this.login.value;
    // this.user.password = this.password.value;
    this.user.email = this.email.value;
    this.user.name = this.name.value;
    this.user.surname = this.surname.value;
    this.user.phone = this.phone.value;
    // this.user.defaultLang = this.defaultLang.value;

    // if (this.selectedRolesIds.length) {
    //   this.user.selectedRoleIds = this.selectedRolesIds;
    // }

    this.authService.registerUser(this.user).subscribe(
      data => {
        swal({
          title: 'User registered!',
          type: 'success',
          timer: 1500
        });
      },
      error => {
        swal({
          title: 'Ooops, something went wrong!',
          type: 'error',
          timer: 1500
        });
      }
    );
  }
}
