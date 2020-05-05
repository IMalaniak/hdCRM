import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../services';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ConfirmPasswordValidator, ApiResponse } from '@/shared';
import { first } from 'rxjs/operators';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';
import * as authActions from '../../store/auth.actions';
import * as authSelectors from '../../store/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: FormGroup;
  hidePassword = true;
  serverResponse: ApiResponse;
  currentPath: string;
  token: string;
  newPasswordForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(authSelectors.isLoading));
    this.currentPath = this.route.snapshot.url[0].path;
    // TODO: get detailed error from serv
    this.store.pipe(select(authSelectors.getApiResponse)).subscribe(resp => {
      this.serverResponse = resp;
    });

    if (this.currentPath === 'request-new-password' || this.currentPath === 'login') {
      this.prepareUserForm();
    } else if (this.currentPath === 'password-reset' || this.currentPath === 'activate-account') {
      this.token = this.route.snapshot.paramMap.get('token');
      if (this.currentPath === 'activate-account') {
        this.activateAccount();
      } else if (this.currentPath === 'password-reset') {
        this.preparePasswordResetForm();
      }
    }
  }

  prepareUserForm(): void {
    this.user = this._formBuilder.group({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('')
    });
    if (this.currentPath === 'login') {
      this.user.get('password').setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  preparePasswordResetForm(): void {
    this.newPasswordForm = this._formBuilder.group(
      {
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]),
        confirmPassword: new FormControl('', [Validators.required])
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
  }

  activateAccount(): void {
    // TODO change to ngrx totallly
    this.authService
      .activateAccount(this.token)
      .pipe(first())
      .subscribe(
        response => {
          this.serverResponse = response;
          if (response.success) {
            const self = this;
            setTimeout(function() {
              self.router.navigate(['/auth']);
            }, 5000);
          }
        },
        error => {
          Swal.fire({
            title: 'Account activation failed',
            icon: 'error',
            timer: 3000
          });
        }
      );
  }

  onLoginSubmit() {
    this.store.dispatch(authActions.logIn({ user: this.user.value }));
  }

  onResetPasswordRequest() {
    // TODO change to ngrx totallly
    this.store.dispatch(authActions.resetPassword({ user: this.user.value }));
    this.authService
      .requestPasswordReset(this.user.value)
      .pipe(first())
      .subscribe(
        response => {
          this.serverResponse = response;
          this.store.dispatch(authActions.resetPasswordSuccess({ response }));
        },
        error => {
          this.store.dispatch(authActions.resetPasswordFailure({ response: error }));
          // Swal.fire({
          //   title: 'Email or login delivery failed!',
          //   icon: 'error',
          //   timer: 3000
          // });
        }
      );
  }

  get newPassword() {
    return this.newPasswordForm.get('newPassword');
  }
  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }

  onResetPassword() {
    // TODO change to ngrx totallly
    this.authService
      .resetPassword({
        token: this.token,
        newPassword: this.newPassword.value,
        verifyPassword: this.confirmPassword.value
      })
      .pipe(first())
      .subscribe(
        response => {
          this.serverResponse = response;
          if (response.success) {
            const self = this;
            setTimeout(function() {
              self.router.navigate(['/auth']);
            }, 3000);
          }
        },
        error => {
          Swal.fire({
            title: 'Ooops, something went wrong!',
            icon: 'error',
            timer: 1500
          });
        }
      );
  }
}
