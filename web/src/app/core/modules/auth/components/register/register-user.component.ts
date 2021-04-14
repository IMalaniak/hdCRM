import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '@core/modules/user-api/shared';
import { IconsService } from '@core/services';
import {
  CommonConstants,
  ACTION_LABEL,
  BUTTON_TYPE,
  MAT_BUTTON,
  THEME_PALETTE,
  RoutingConstants,
  ORGANIZATION_TYPE,
  BS_ICON,
  INPUT_TYPE
} from '@shared/constants';

import { registerUser } from '../../store/auth.actions';
import { AuthState } from '../../store/auth.reducer';
import { isLoading } from '../../store/auth.selectors';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterUserComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this.store.pipe(select(isLoading));

  registerData: FormGroup;
  hidePassword = true;

  orgTypes = ORGANIZATION_TYPE;
  actionLabels = ACTION_LABEL;
  buttonTypes = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  inputTypes = INPUT_TYPE;
  themePalette = THEME_PALETTE;
  loginRoute = RoutingConstants.ROUTE_AUTH_LOGIN;
  icons: { [key: string]: BS_ICON } = {
    right: BS_ICON.ArrowRight,
    left: BS_ICON.ArrowLeft,
    reset: BS_ICON.ArrowCounterclockwise,
    submit: BS_ICON.Upload,
    eye: BS_ICON.Eye,
    eyeDisabled: BS_ICON.EyeSlash,
    stepperEdit: BS_ICON.PencilSquare,
    stepperDone: BS_ICON.Check
  };

  private unsubscribe: Subject<void> = new Subject();

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
          Validators.pattern(CommonConstants.LOGIN_REGEX)
        ]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        generatePassword: new FormControl(null)
      }),
      userPersonalInfo: this.fb.group({
        name: new FormControl(null, [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(CommonConstants.ONLY_TEXT_REGEX)
        ]),
        surname: new FormControl(null, [
          Validators.required,
          Validators.maxLength(25),
          Validators.pattern(CommonConstants.ONLY_TEXT_REGEX)
        ]),
        phone: new FormControl(null, [Validators.pattern(CommonConstants.PHONE_REGEX)])
      }),
      userOrganization: this.fb.group({
        type: new FormControl(null),
        title: new FormControl(null, [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(CommonConstants.ONLY_TEXT_REGEX)
        ]),
        employees: new FormControl(null),
        country: new FormControl(null),
        city: new FormControl(null),
        address: new FormControl(null),
        postcode: new FormControl(null),
        phone: new FormControl(null, Validators.pattern(CommonConstants.PHONE_REGEX)),
        email: new FormControl(null, Validators.email),
        website: new FormControl(null, [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(CommonConstants.WWW_REGEX)
        ])
      })
    });
  }

  initPasswordValidation(): void {
    const password: AbstractControl = this.getControl('userCredentials', 'password');

    this.getControl('userCredentials', 'generatePassword')
      .valueChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
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

    this.getControl('userOrganization', 'type')
      .valueChanges.pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        if (value === ORGANIZATION_TYPE.COMPANY) {
          orgTitle.setValidators([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(CommonConstants.ONLY_TEXT_REGEX)
          ]);
          orgWebsite.setValidators([
            Validators.required,
            Validators.maxLength(100),
            Validators.pattern(CommonConstants.WWW_REGEX)
          ]);
        } else if (value === ORGANIZATION_TYPE.PRIVATE) {
          orgTitle.setValidators(null);
          orgTitle.reset();
          orgWebsite.setValidators([Validators.maxLength(100), Validators.pattern(CommonConstants.WWW_REGEX)]);
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
