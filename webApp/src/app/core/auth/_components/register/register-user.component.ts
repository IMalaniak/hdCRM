import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../_services';
import { User, Organization } from '@/_modules/users';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  user: User;
  userData: FormGroup;
  hidePassword = true;
  selectedRolesIds: number[];
  submitDisabled = false;

  constructor(private authService: AuthenticationService, private _formBuilder: FormBuilder) {
    this.user = new User();
    this.user.Organization = new Organization();
  }

  ngOnInit() {
    this.userData = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          login: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(25),
            Validators.pattern('^[a-zA-Z0-9]+$')
          ]),
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required, Validators.minLength(6)]),
          generatePassword: new FormControl('')
        }),
        this._formBuilder.group({
          name: new FormControl('', [
            Validators.required,
            Validators.maxLength(25),
            Validators.pattern(
              "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
            )
          ]),
          surname: new FormControl('', [
            Validators.required,
            Validators.maxLength(25),
            Validators.pattern(
              "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
            )
          ]),
          phone: new FormControl('', [Validators.pattern('^[0-9]+$')])
        }),
        this._formBuilder.group({
          organizationType: new FormControl(''),
          title: new FormControl('', [Validators.required, Validators.maxLength(150)]),
          employees: new FormControl(''),
          country: new FormControl(''),
          city: new FormControl(''),
          address: new FormControl(''),
          postcode: new FormControl(''),
          organizationPhone: new FormControl('', Validators.pattern('^[0-9]+$')),
          organizationEmail: new FormControl(
            '',
            Validators.pattern(
              '^([A-Z|a-z|0-9](.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((.){0,1}[A-Z|a-z|0-9]){2}.[a-z]{2,3}$'
            )
          ),
          website: new FormControl('', [
            Validators.required,
            Validators.pattern(
              '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
            )
          ])
        })
      ])
    });

    this.generatePassword.valueChanges.subscribe(value => {
      if (value) {
        this.password.setValidators(null);
        this.password.reset();
      } else {
        this.password.setValidators([Validators.required, Validators.minLength(6)]);
      }
      this.password.updateValueAndValidity();
    });

    this.organizationType.valueChanges.subscribe(value => {
      if (value === 'company') {
        this.title.setValidators([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
          )
        ]);
      } else if (value === 'private') {
        this.title.setValidators(null);
        this.title.reset();
      }
      this.title.updateValueAndValidity();
    });
  }

  get formArray(): AbstractControl | null {
    return this.userData.get('formArray');
  }
  get login() {
    return this.formArray.get([0]).get('login');
  }
  get password() {
    return this.formArray.get([0]).get('password');
  }
  get generatePassword() {
    return this.formArray.get([0]).get('generatePassword');
  }
  get email() {
    return this.formArray.get([0]).get('email');
  }
  get name() {
    return this.formArray.get([1]).get('name');
  }
  get surname() {
    return this.formArray.get([1]).get('surname');
  }
  get phone() {
    return this.formArray.get([1]).get('phone');
  }
  get organizationType() {
    return this.formArray.get([2]).get('organizationType');
  }
  get title() {
    return this.formArray.get([2]).get('title');
  }
  get employees() {
    return this.formArray.get([2]).get('employees');
  }
  get country() {
    return this.formArray.get([2]).get('country');
  }
  get city() {
    return this.formArray.get([2]).get('city');
  }
  get address() {
    return this.formArray.get([2]).get('address');
  }
  get organizationPhone() {
    return this.formArray.get([2]).get('organizationPhone');
  }
  get organizationEmail() {
    return this.formArray.get([2]).get('organizationEmail');
  }
  get postcode() {
    return this.formArray.get([2]).get('postcode');
  }
  get website() {
    return this.formArray.get([2]).get('website');
  }

  onRegisterSubmit() {
    this.submitDisabled = true;
    this.user.login = this.login.value;
    if (!this.generatePassword.value) {
      this.user.password = this.password.value;
    }
    this.user.email = this.email.value;
    this.user.name = this.name.value;
    this.user.surname = this.surname.value;
    this.user.phone = this.phone.value;
    this.user.Organization.type = this.organizationType.value;
    if (this.organizationType.value === 'company') {
      this.user.Organization.title = this.title.value;
      this.user.Organization.employees = this.employees.value;
      this.user.Organization.country = this.country.value;
      this.user.Organization.city = this.city.value;
      this.user.Organization.address = this.address.value;
      this.user.Organization.postcode = this.postcode.value;
      this.user.Organization.phone = this.organizationPhone.value;
      this.user.Organization.email = this.organizationEmail.value;
    }
    this.user.Organization.website = this.website.value;
    this.authService.registerUser(this.user).subscribe(
      data => {
        Swal.fire({
          title: 'User registered!',
          type: 'success',
          timer: 1500
        });
      },
      error => {
        this.submitDisabled = false;
        Swal.fire({
          title: 'Ooops, something went wrong!',
          type: 'error',
          timer: 1500
        });
      }
    );
  }
}
