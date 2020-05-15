import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../services';
import { User } from '@/modules/users';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  registerData: FormGroup;
  hidePassword = true;
  selectedRolesIds: number[];
  submitDisabled = false;

  constructor(private authService: AuthenticationService, private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.registerData = this._formBuilder.group({
      userCredentials: this._formBuilder.group({
        login: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25),
          Validators.pattern('^[a-zA-Z0-9]+$')
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        generatePassword: new FormControl(null)
      }),
      userPersonalInfo: this._formBuilder.group({
        name: new FormControl(null, [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(
            "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
          )
        ]),
        surname: new FormControl(null, [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(
            "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
          )
        ]),
        phone: new FormControl(null, [Validators.pattern('^[0-9]+$')])
      }),
      userOrganization: this._formBuilder.group({
        type: new FormControl(null),
        title: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
        employees: new FormControl(null),
        country: new FormControl(null),
        city: new FormControl(null),
        address: new FormControl(null),
        postcode: new FormControl(null),
        phone: new FormControl(null, Validators.pattern('^[0-9]+$')),
        email: new FormControl(
          null,
          Validators.pattern(
            '^([A-Z|a-z|0-9](.|_){0,1})+[A-Z|a-z|0-9]@([A-Z|a-z|0-9])+((.){0,1}[A-Z|a-z|0-9]){2}.[a-z]{2,3}$'
          )
        ),
        website: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
          )
        ])
      })
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

    this.orgType.valueChanges.subscribe(value => {
      if (value === 'company') {
        this.orgTitle.setValidators([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
          )
        ]);
      } else if (value === 'private') {
        this.orgTitle.setValidators(null);
        this.orgTitle.reset();
      }
      this.orgTitle.updateValueAndValidity();
    });
  }

  get userCredentials() {
    return this.registerData.get('userCredentials');
  }
  get userPersonalInfo() {
    return this.registerData.get('userPersonalInfo');
  }
  get userOrganization() {
    return this.registerData.get('userOrganization');
  }
  get login() {
    return this.userCredentials.get('login');
  }
  get password() {
    return this.userCredentials.get('password');
  }
  get generatePassword() {
    return this.userCredentials.get('generatePassword');
  }
  get email() {
    return this.userCredentials.get('email');
  }
  get name() {
    return this.userPersonalInfo.get('name');
  }
  get surname() {
    return this.userPersonalInfo.get('surname');
  }
  get phone() {
    return this.userPersonalInfo.get('phone');
  }
  get orgType() {
    return this.userOrganization.get('type');
  }
  get orgTitle() {
    return this.userOrganization.get('title');
  }
  get orgEmployees() {
    return this.userOrganization.get('employees');
  }
  get orgCountry() {
    return this.userOrganization.get('country');
  }
  get orgCity() {
    return this.userOrganization.get('city');
  }
  get orgAddress() {
    return this.userOrganization.get('address');
  }
  get orgPhone() {
    return this.userOrganization.get('phone');
  }
  get orgEmail() {
    return this.userOrganization.get('email');
  }
  get orgPostcode() {
    return this.userOrganization.get('postcode');
  }
  get orgWebsite() {
    return this.userOrganization.get('website');
  }

  onRegisterSubmit() {
    const { userCredentials, userPersonalInfo, userOrganization } = this.registerData.value;
    const user: User = { ...userCredentials, ...userPersonalInfo };
    user.Organization = { ...userOrganization };
    this.submitDisabled = true;
    this.authService.registerUser(user).subscribe(
      data => {
        Swal.fire({
          title: 'User registered!',
          icon: 'success',
          timer: 1500
        });
      },
      error => {
        this.submitDisabled = false;
        Swal.fire({
          title: 'Ooops, something went wrong!',
          icon: 'error',
          timer: 1500
        });
      }
    );
  }
}
