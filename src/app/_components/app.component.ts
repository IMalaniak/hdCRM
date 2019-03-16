import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, PrivilegeService, MediaqueryService } from '@/_services';
import { Router, NavigationEnd } from '@angular/router';
import { User } from '@/_models';
import swal from 'sweetalert2';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sidebarMinimized: boolean;
  baseUrl: string;
  showDebug: boolean;

  constructor(
    private authService: AuthenticationService,
    private privilegeService: PrivilegeService,
    private router: Router,
    public mediaquery: MediaqueryService
  ) {
    this.showDebug = false;
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    if (this.isValidToken) {
      this.authService.currentUser.subscribe(user => {
        this.showDebug = this.privilegeService.isPrivileged(user, 'showDebug');
      });
    }

    if (this.mediaquery.isMobileDevice) {
      this.sidebarMinimized = true;
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
        this.sidebarMinimized = true;
      });
    } else {
      this.sidebarMinimized = JSON.parse(localStorage.getItem('sidebarMinimized'));
    }
  }

  get isValidToken(): boolean {
    return this.authService.validToken();
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/home']);
    swal({
      text: 'Logged out!',
      type: 'info',
      timer: 1000
    });
  }

  toogleSidebar() {
    this.sidebarMinimized = !this.sidebarMinimized;
    localStorage.setItem('sidebarMinimized', JSON.stringify(this.sidebarMinimized));
  }
}
