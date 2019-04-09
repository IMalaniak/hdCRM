import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, MediaqueryService, PrivilegeService } from '@/_shared/services';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-private',
  template: `
    <section class="grid">
      <app-header [sidebarMinimized]="sidebarMinimized" (hideSidebar)="toogleSideBar($event)"></app-header>
      <main>
          <app-sidebar [sidebarMinimized]="sidebarMinimized"></app-sidebar>
          <section class="content">
              <section class="container-fluid">
                  <router-outlet></router-outlet>
              </section>

              <app-footer></app-footer>
          </section>
          <div class="overlay" *ngIf="mediaquery.isMobileDevice" [ngClass]="{'isVisible': !sidebarMinimized}" (click)="sidebarMinimized=true"></div>
      </main>
      <section class="app-messages" *ngIf="showDebug && isValidToken"></section>
    </section>
  `,
  styles: []
})
export class PrivateViewComponent implements OnInit {
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

    toogleSideBar(minimized: boolean) {
      this.sidebarMinimized = minimized;
      localStorage.setItem('sidebarMinimized', JSON.stringify(this.sidebarMinimized));
    }
}
