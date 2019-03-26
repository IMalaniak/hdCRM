import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AuthenticationService } from '@/_services';
import { User, Response } from '@/_models';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ConfirmPasswordValidator } from '@/_validators/confirm-password'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user: User = new User();
  returnUrl: string;
  hidePassword = true;
  passwordResetResponse: Response;
  currentPath: string;
  token: string;
  newPasswordForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // reset login status
    this.authService.logout();
    this.currentPath = this.route.snapshot.url[0].path;
    // get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.currentPath === 'password-reset') {
      this.preparePasswordResetFnc();
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

  get newPassword() { return this.newPasswordForm.get('newPassword'); }
  get confirmPassword() { return this.newPasswordForm.get('confirmPassword'); }

  onLoginSubmit() {
    this.authService.login(this.user).pipe(first()).subscribe(
      user => {
        this.router.navigate([this.returnUrl]);
      },
      error => {
        swal({
          title: 'error',
          text: 'error',
          type: 'error',
          timer: 1500
        }).then((result) => {
          if (result.dismiss === swal.DismissReason.timer) {
            this.router.navigate(['/auth']);
          }
        });
      }
    );
  }

  onResetPasswordRequest() {
    this.authService.requestPasswordReset(this.user).pipe(first()).subscribe(
      response => {
        this.passwordResetResponse = response;
      },
      error => {
        swal({
          title: 'Email or login delivery failed!',
          type: 'error',
          timer: 3000
        });
      }
    );
  }

  onResetPassword() {
    this.authService.resetPassword({token: this.token, newPassword: this.newPassword.value, verifyPassword: this.confirmPassword.value}).pipe(first()).subscribe(
      response => {
        this.passwordResetResponse = response;
        if (response.success) {
          const self = this;
          setTimeout(function() {
            self.router.navigate(['/auth']);
          }, 3000);
        }
      },
      error => {
        swal({
          title: 'Ooops, something went wrong!',
          type: 'error',
          timer: 1500
        });
    })
  }
}
