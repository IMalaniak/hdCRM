import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ConfirmPasswordValidator, NewPassword, ToastMessageService } from '@/shared';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';
import * as authActions from '../../store/auth.actions';
import * as authSelectors from '../../store/auth.selectors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
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

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.currentPath = this.route.snapshot.url[0].path;
    this.store.pipe(select(authSelectors.getApiResponse), takeUntil(this.unsubscribe)).subscribe(serverResponse => {
      if (serverResponse) {
        this.toastMessageService.snack(serverResponse, 5000);
      }
    });

    if (this.currentPath === 'request-new-password' || this.currentPath === 'login') {
      this.prepareUserForm();
    } else if (this.currentPath === 'password-reset' || this.currentPath === 'activate-account') {
      this.token = this.route.snapshot.paramMap.get('token');
      if (this.currentPath === 'activate-account') {
        this.prepareUserForm();
        this.activateAccount();
      } else if (this.currentPath === 'password-reset') {
        this.preparePasswordResetForm();
      }
    }
  }

  prepareUserForm(): void {
    this.user = this.fb.group({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('')
    });
    if (this.currentPath === 'login') {
      this.user.get('password').setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  preparePasswordResetForm(): void {
    this.newPasswordForm = this.fb.group(
      {
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]),
        verifyPassword: new FormControl('', [Validators.required])
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword
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

  get newPassword() {
    return this.newPasswordForm.get('newPassword');
  }
  get verifyPassword() {
    return this.newPasswordForm.get('verifyPassword');
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
