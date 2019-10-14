import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { MediaqueryService } from '@/_shared/services';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { User } from '@/_modules/users';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import * as layoutActions from '../store/layout.actions'; 
import * as fromLayout from '../store/';
import { privateRouterTransition } from '@/_shared/animations/private-router-transition';

@Component({
  selector: 'app-private',
  template: `
    <section class="grid">
      <app-header [sidebarMinimized]="sidebarMinimized$ | async" [currentUser]="currentUser$ | async" (hideSidebar)="toogleSideBar($event)"></app-header>
      <main>
          <app-sidebar [sidebarMinimized]="sidebarMinimized$ | async"></app-sidebar>
          <section class="content">
              <section class="container-fluid position-relative" [@privateRouterAnimations]="prepareRoute(outlet)">
                  <router-outlet #outlet="outlet"></router-outlet>
              </section>

              <app-footer></app-footer>
          </section>
          <div class="overlay" *ngIf="mediaquery.isMobileDevice" [ngClass]="{'isVisible': !sidebarMinimized$ | async}" (click)="toogleSideBar(true)"></div>
      </main>
<!--      <section class="app-messages" *ngIf="showDebug$ | async"></section> -->
    </section>
  `,
  styles: [],
  animations: [
    privateRouterTransition
  ]})
export class PrivateViewComponent implements OnInit {
    sidebarMinimized$: Observable<boolean>;
    baseUrl: string;
    showDebug$: Observable<boolean>;
    currentUser$: Observable<User>;

    constructor(
      private router: Router,
      public mediaquery: MediaqueryService,
      private store: Store<AppState>
    ) {
      this.baseUrl = environment.baseUrl;
    }

    ngOnInit() {
      this.currentUser$ = this.store.pipe(select(currentUser));
      this.sidebarMinimized$ = this.store.pipe(select(fromLayout.getSidebarState));
      this.showDebug$ = this.store.pipe(select(isPrivileged('showDebug')));

      if (this.mediaquery.isMobileDevice) {
        this.toogleSideBar(true);
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
          this.toogleSideBar(true);
        });
      }
    }

    toogleSideBar(minimized: boolean) {
      this.store.dispatch(new layoutActions.ToggleSidebar(minimized));
    }

    prepareRoute(outlet: RouterOutlet) {
      return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
}
