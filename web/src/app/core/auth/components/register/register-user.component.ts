import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { User } from '@/modules/users';
import { AuthState } from '../../store/auth.reducer';
import { registerUser } from '../../store/auth.actions';
import { isLoading } from '../../store/auth.selectors';
import { Observable } from 'rxjs';
import { CONSTANTS, IFieldType, ACTION_LABELS } from '@/shared/constants';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterUserComponent implements OnInit {
  isLoading$: Observable<boolean> = this.store.pipe(select(isLoading));

  registerData: FormGroup;
  hidePassword = true;
  fieldTypes = IFieldType;

  actionLabels = ACTION_LABELS;

  constructor(private store: Store<AuthState>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildRegisterFormGroup();
    this.initPasswordValidation();
    this.initOrganizationValidation();
  }

  buildRegisterFormGroup(): void {
    this.registerData = this.fb.group({
      userCredentials: this.fb.group({
        login: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25),
          Validators.pattern(CONSTANTS.LOGIN_REGEX)
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        generatePassword: new FormControl(null)
      }),
      userPersonalInfo: this.fb.group({
        name: new FormControl(null, [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(CONSTANTS.ONLY_TEXT_REGEX)
        ]),
        surname: new FormControl(null, [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(CONSTANTS.ONLY_TEXT_REGEX)
        ]),
        phone: new FormControl(null, [Validators.pattern(CONSTANTS.PHONE_REGEX)])
      }),
      userOrganization: this.fb.group({
        type: new FormControl(null),
        title: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
        employees: new FormControl(null),
        country: new FormControl(null),
        city: new FormControl(null),
        address: new FormControl(null),
        postcode: new FormControl(null),
        phone: new FormControl(null, Validators.pattern(CONSTANTS.PHONE_REGEX)),
        email: new FormControl(null, Validators.email),
        website: new FormControl(null, [Validators.required, Validators.pattern(CONSTANTS.WWW_REGEX)])
      })
    });
  }

  initPasswordValidation(): void {
    const password: AbstractControl = this.getControl('userCredentials', 'password');

    this.getControl('userCredentials', 'generatePassword').valueChanges.subscribe((value) => {
      if (value) {
        password.setValidators(null);
        password.reset();
      } else {
        password.setValidators([Validators.required, Validators.minLength(6)]);
      }
      password.updateValueAndValidity();
    });
  }

  initOrganizationValidation(): void {
    const title: AbstractControl = this.getControl('userOrganization', 'title');

    this.getControl('userOrganization', 'type').valueChanges.subscribe((value) => {
      if (value === 'company') {
        title.setValidators([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(CONSTANTS.ONLY_TEXT_REGEX)
        ]);
      } else if (value === 'private') {
        title.setValidators(null);
        title.reset();
      }
      title.updateValueAndValidity();
    });
  }

  getControl(formGroup: string, formControl: string): AbstractControl {
    return this.registerData.get(formGroup).get(formControl);
  }

  onRegisterSubmit(): void {
    const { userCredentials, userPersonalInfo, userOrganization } = this.registerData.value;
    const user: User = { ...userCredentials, ...userPersonalInfo, Organization: userOrganization };
    this.store.dispatch(registerUser({ user }));
  }
}
