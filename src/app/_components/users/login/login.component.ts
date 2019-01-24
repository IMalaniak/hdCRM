import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AuthenticationService, TranslationsService } from '@/_services';
import { User } from '@/_models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  translations: Object;
  user: User = new User();
  returnUrl: string;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private translationsService: TranslationsService
  ) { }

  ngOnInit() {
    this.translationsService.getTranslations([
      'LOGINCOMPONENT.Alerts.loginFailedTitle',
      'LOGINCOMPONENT.Alerts.loginFailedText',
      'LOGINCOMPONENT.Header',
      'LOGINCOMPONENT.LoginForm.login',
      'LOGINCOMPONENT.LoginForm.password',
      'LOGINCOMPONENT.LoginForm.buttonLogIn'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });

    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onLoginSubmit() {
    this.authService.login(this.user).pipe(first()).subscribe(
      user => {
        if (user.defaultLang) {
          this.translationsService.translate.use(user.defaultLang);
        }
        this.router.navigate([this.returnUrl]);
      },
      error => {
        swal({
          title: this.translations['LOGINCOMPONENT.Alerts.loginFailedTitle'],
          text: this.translations['LOGINCOMPONENT.Alerts.loginFailedText'],
          type: 'error',
          timer: 1500
        }).then((result) => {
          if (result.dismiss === swal.DismissReason.timer) {
            this.router.navigate(['/login']);
          }
        });
      }
    );
  }

}
