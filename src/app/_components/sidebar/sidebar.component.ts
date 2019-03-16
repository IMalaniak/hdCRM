import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, MediaqueryService } from '@/_services';

@Component({
  selector: '.app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    public mediaquery: MediaqueryService
  ) { }

  ngOnInit() {
  }

  get isValidToken(): boolean {
    return this.authService.validToken();
  }


}
