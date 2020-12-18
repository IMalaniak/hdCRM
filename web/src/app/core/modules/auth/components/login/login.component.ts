import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { ConfirmPasswordValidator } from '@/shared/validators';
import { NewPassword } from '@/shared/models';
import {
  ACTION_LABELS,
  THEME_PALETTE,
  BUTTON_TYPE,
  MAT_BUTTON,
  PATHS,
  RoutingConstants,
  BS_ICONS,
  InputType
} from '@/shared/constants';
import * as authActions from '../../store/auth.actions';
import * as authSelectors from '../../store/auth.selectors';
import { IconsService } from '@/core/services';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading$: Observable<boolean> = this.store.pipe(select(authSelectors.isLoading));

  user: FormGroup;
  newPasswordForm: FormGroup;
  currentPath: string;
  hidePassword = true;
  token: string;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;
  buttonType = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  inputTypes = InputType;
  paths = PATHS;
  routes = RoutingConstants;
  icons: { [key: string]: BS_ICONS } = {
    key: BS_ICONS.Key,
    disabled: BS_ICONS.SlashCircle,
    cancel: BS_ICONS.X,
    arrow: BS_ICONS.ArrowRight,
    submit: BS_ICONS.Check,
    eye: BS_ICONS.Eye,
    eyeDisabled: BS_ICONS.EyeSlash
  };

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([...Object.values(this.icons)]);
  }

  ngOnInit(): void {
    this.currentPath = this.route.snapshot.url[0].path;

    if (this.currentPath === PATHS.REQUEST_NEW_PASSWORD || this.currentPath === PATHS.LOGIN) {
      this.prepareUserForm();
    } else if (this.currentPath === PATHS.PASSWORD_RESET || this.currentPath === PATHS.ACTIVATE_ACCOUNT) {
      this.token = this.route.snapshot.paramMap.get('token');
      if (this.currentPath === PATHS.ACTIVATE_ACCOUNT) {
        this.prepareUserForm();
        this.activateAccount();
      } else if (this.currentPath === PATHS.PASSWORD_RESET) {
        this.preparePasswordResetForm();
      }
    }
  }

  prepareUserForm(): void {
    this.user = this.fb.group({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null)
    });
    if (this.currentPath === PATHS.LOGIN) {
      this.user.get('password').setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  preparePasswordResetForm(): void {
    this.newPasswordForm = this.fb.group(
      {
        newPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]),
        verifyPassword: new FormControl(null, [Validators.required])
      },
      {
        validators: ConfirmPasswordValidator.MatchPassword
      }
    );
  }

  activateAccount(): void {
    this.store.dispatch(authActions.activateAccount({ token: this.token }));
  }

  onLoginSubmit() {
    this.store.dispatch(authActions.logIn({ user: this.user.value }));
  }

  onResetPasswordRequest() {
    this.store.dispatch(authActions.resetPasswordRequest({ user: this.user.value }));
  }

  onResetPassword() {
    const newPassword: NewPassword = {
      token: this.token,
      ...this.newPasswordForm.value
    };
    this.store.dispatch(authActions.setNewPassword({ newPassword }));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
