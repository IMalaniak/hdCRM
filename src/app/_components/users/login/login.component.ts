import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AuthenticationService } from '@/_services';
import { User } from '@/_models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = new User();
  returnUrl: string;
  hidePassword = true;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

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
            this.router.navigate(['/login']);
          }
        });
      }
    );
  }

}
