import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { GoogleAuthService } from '@core/modules/google-api/services/google-auth.service';
import { IconsService } from '@core/services';
import { AppState } from '@core/store';
import {
  ACTION_LABEL,
  THEME_PALETTE,
  BUTTON_TYPE,
  MAT_BUTTON,
  PathConstants,
  RoutingConstants,
  BS_ICON,
  INPUT_TYPE
} from '@shared/constants';
import { NewPassword } from '@shared/models';
import { ConfirmPasswordValidator } from '@shared/validators';

import * as authActions from '../../store/auth.actions';
import * as authSelectors from '../../store/auth.selectors';

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

  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;
  buttonType = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  inputTypes = INPUT_TYPE;
  paths = PathConstants;
  routes = RoutingConstants;
  icons: { [key: string]: BS_ICON } = {
    key: BS_ICON.Key,
    disabled: BS_ICON.SlashCircle,
    cancel: BS_ICON.X,
    arrow: BS_ICON.ArrowRight,
    submit: BS_ICON.Check,
    eye: BS_ICON.Eye,
    eyeDisabled: BS_ICON.EyeSlash
  };
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly iconsService: IconsService,
    private readonly googleAuthService: GoogleAuthService
  ) {
    this.iconsService.registerIcons([...Object.values(this.icons)]);
  }

  ngOnInit(): void {
    this.currentPath = this.route.snapshot.url[0].path;

    if (this.currentPath === PathConstants.REQUEST_NEW_PASSWORD || this.currentPath === PathConstants.LOGIN) {
      this.prepareUserForm();
    } else if (
      this.currentPath === PathConstants.PASSWORD_RESET ||
      this.currentPath === PathConstants.ACTIVATE_ACCOUNT
    ) {
      this.token = this.route.snapshot.paramMap.get('token');
      if (this.currentPath === PathConstants.ACTIVATE_ACCOUNT) {
        this.prepareUserForm();
        this.activateAccount();
      } else if (this.currentPath === PathConstants.PASSWORD_RESET) {
        this.preparePasswordResetForm();
      }
    }
  }

  prepareUserForm(): void {
    this.user = this.fb.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null)
    });
    if (this.currentPath === PathConstants.LOGIN) {
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
        validators: ConfirmPasswordValidator.matchPassword
      }
    );
  }

  activateAccount(): void {
    this.store.dispatch(authActions.activateAccount({ token: this.token }));
  }

  onGoogleSignIn(): void {
    this.googleAuthService.getAuth().subscribe((auth) => {
      auth
        .signIn()
        .then((googleUser) =>
          this.store.dispatch(authActions.googleOauth({ token: googleUser.getAuthResponse().id_token }))
        );
    });
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
