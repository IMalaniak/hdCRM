import { environment } from 'environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService, MediaqueryService } from '@/_shared/services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidebarMinimized: boolean;
  baseUrl: string;
  @Output()
  hideSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public mediaquery: MediaqueryService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {

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
    this.hideSidebar.emit(!this.sidebarMinimized);
  }

}
