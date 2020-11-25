import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { IconsService } from '@/core/services';
import {
  CONSTANTS,
  IFieldType,
  ACTION_LABELS,
  BUTTON_TYPE,
  MAT_BUTTON,
  THEME_PALETTE,
  RoutingConstants,
  OrgType,
  BS_ICONS
} from '@/shared/constants';
import { User } from '@/modules/users';
import { AuthState } from '../../store/auth.reducer';
import { registerUser } from '../../store/auth.actions';
import { isLoading } from '../../store/auth.selectors';

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

  orgTypes = OrgType;
  actionLabels = ACTION_LABELS;
  buttonTypes = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  loginRoute = RoutingConstants.ROUTE_AUTH_LOGIN;
  icons: { [key: string]: BS_ICONS } = {
    right: BS_ICONS.ArrowRight,
    left: BS_ICONS.ArrowLeft,
    reset: BS_ICONS.ArrowCounterclockwise,
    submit: BS_ICONS.Upload,
    eye: BS_ICONS.Eye,
    eyeDisabled: BS_ICONS.EyeSlash,
    stepperEdit: BS_ICONS.PencilSquare,
    stepperDone: BS_ICONS.Check
  };

  constructor(private store: Store<AuthState>, private fb: FormBuilder, private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([...Object.values(this.icons)]);
  }

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
        title: new FormControl(null, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(CONSTANTS.ONLY_TEXT_REGEX)
        ]),
        employees: new FormControl(null),
        country: new FormControl(null),
        city: new FormControl(null),
        address: new FormControl(null),
        postcode: new FormControl(null),
        phone: new FormControl(null, Validators.pattern(CONSTANTS.PHONE_REGEX)),
        email: new FormControl(null, Validators.email),
        website: new FormControl(null, [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(CONSTANTS.WWW_REGEX)
        ])
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
    const orgTitle: AbstractControl = this.getControl('userOrganization', 'title');
    const orgWebsite: AbstractControl = this.getControl('userOrganization', 'website');

    this.getControl('userOrganization', 'type').valueChanges.subscribe((value) => {
      if (value === OrgType.COMPANY) {
        orgTitle.setValidators([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(CONSTANTS.ONLY_TEXT_REGEX)
        ]);
        orgWebsite.setValidators([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(CONSTANTS.WWW_REGEX)
        ]);
      } else if (value === OrgType.PRIVATE) {
        orgTitle.setValidators(null);
        orgTitle.reset();
        orgWebsite.setValidators([Validators.maxLength(100), Validators.pattern(CONSTANTS.WWW_REGEX)]);
        orgWebsite.reset();
      }
      orgTitle.updateValueAndValidity();
      orgWebsite.updateValueAndValidity();
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
