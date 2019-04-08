import { Component, OnInit, ViewEncapsulation, Input, HostBinding } from '@angular/core';
import { AuthenticationService, MediaqueryService } from '@/_shared/services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {
  @Input() sidebarMinimized: boolean;
  @HostBinding('class.minimized') get minimized() { return this.sidebarMinimized; }

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
