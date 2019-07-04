import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../_services';
import { ApiResponse } from '@/core/_models';
import { User } from '@/_modules/users';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ConfirmPasswordValidator } from '@/_shared/validators';
import { first } from 'rxjs/operators';
import { AppState } from '@/core/reducers';
import { Store, select } from '@ngrx/store';
import * as authActions from '../../store/auth.actions';
import { getApiResponse, isLoading } from '../../store/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User = new User();
  returnUrl: string;
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
    this.isLoading$ = this.store.pipe(select(isLoading));
    this.currentPath = this.route.snapshot.url[0].path;
    // get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.currentPath === 'password-reset') {
      this.preparePasswordResetFnc();
    } else if (this.currentPath === 'activate-account') {
      this.prepareAccountActivationFnc();
    } else if (this.currentPath === 'login') {
      // TODO: get detailed error from serv
      this.store.pipe(select(getApiResponse)).subscribe(resp => {
        this.serverResponse = resp;
      });
    }
  }

  preparePasswordResetFnc(): void {
    this.token = this.route.snapshot.paramMap.get('token');

    this.newPasswordForm = this._formBuilder.group({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(64)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    }, {
        validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  prepareAccountActivationFnc(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.authService.activateAccount(this.token).pipe(first()).subscribe(
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
          type: 'error',
          timer: 3000
        });
      }
    );
  }

  onLoginSubmit() {
    this.store.dispatch(new authActions.LogIn(this.user));
  }

  onResetPasswordRequest() {
    // TODO change to ngrx totallly
    this.store.dispatch(new authActions.ResetPassword(this.user));
    this.authService.requestPasswordReset(this.user).pipe(first()).subscribe(
      response => {
        this.serverResponse = response;
        this.store.dispatch(new authActions.ResetPasswordSuccess(response));
      },
      error => {
        this.store.dispatch(new authActions.ResetPasswordFailure(error));
        // Swal.fire({
        //   title: 'Email or login delivery failed!',
        //   type: 'error',
        //   timer: 3000
        // });
      }
    );
  }

  get newPassword() { return this.newPasswordForm.get('newPassword'); }
  get confirmPassword() { return this.newPasswordForm.get('confirmPassword'); }

  onResetPassword() {
    this.authService.resetPassword({token: this.token, newPassword: this.newPassword.value, verifyPassword: this.confirmPassword.value}).pipe(first()).subscribe(
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
          type: 'error',
          timer: 1500
        });
    });
  }
}
