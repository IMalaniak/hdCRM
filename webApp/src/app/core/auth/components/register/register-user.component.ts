import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { User } from '@/modules/users';
import { AuthState } from '../../store/auth.reducer';
import { registerUser } from '../../store/auth.actions';
import { isLoading } from '../../store/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  registerData: FormGroup;
  hidePassword = true;
  isLoading$: Observable<boolean>;

  constructor(private store: Store<AuthState>, private _formBuilder: FormBuilder) {
    this.isLoading$ = this.store.pipe(select(isLoading));
  }

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
        email: new FormControl(null, Validators.email),
        website: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
          )
        ])
      })
    });

    this.userCredentials.get('generatePassword').valueChanges.subscribe(value => {
      if (value) {
        this.userCredentials.get('password').setValidators(null);
        this.userCredentials.get('password').reset();
      } else {
        this.userCredentials.get('password').setValidators([Validators.required, Validators.minLength(6)]);
      }
      this.userCredentials.get('password').updateValueAndValidity();
    });

    this.userOrganization.get('type').valueChanges.subscribe(value => {
      if (value === 'company') {
        this.userOrganization
          .get('title')
          .setValidators([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(
              "^[a-zA-Zа-яА-ЯіІїЇàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$"
            )
          ]);
      } else if (value === 'private') {
        this.userOrganization.get('title').setValidators(null);
        this.userOrganization.get('title').reset();
      }
      this.userOrganization.get('title').updateValueAndValidity();
    });
  }

  get userCredentials(): AbstractControl {
    return this.registerData.get('userCredentials');
  }
  get userPersonalInfo(): AbstractControl {
    return this.registerData.get('userPersonalInfo');
  }
  get userOrganization(): AbstractControl {
    return this.registerData.get('userOrganization');
  }

  onRegisterSubmit() {
    const { userCredentials, userPersonalInfo, userOrganization } = this.registerData.value;
    const user: User = { ...userCredentials, ...userPersonalInfo };
    user.Organization = { ...userOrganization };
    this.store.dispatch(registerUser({ user }));
  }
}
