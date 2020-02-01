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
      <app-header
        [leftSidebarMinimized]="leftSidebarMinimized$ | async"
        [currentUser]="currentUser$ | async"
        (hideLeftSidebar)="toggleLeftSidebar($event)"
      ></app-header>
      <main>
        <app-left-sidebar [leftSidebarMinimized]="leftSidebarMinimized$ | async"></app-left-sidebar>
        <section class="content">
          <div class="wrapper">
            <section class="container-fluid position-relative" [@privateRouterAnimations]="prepareRoute(outlet)">
              <router-outlet #outlet="outlet"></router-outlet>
            </section>
            <app-footer></app-footer>
          </div>
          <app-right-sidebar
            [rightSidebarMinimized]="rightSidebarMinimized$ | async"
            (hideRightSidebar)="toggleRightSidebar($event)"
          ></app-right-sidebar>
        </section>
        <div
          class="overlay"
          *ngIf="mediaquery.isMobileDevice"
          [ngClass]="{ isVisible: !leftSidebarMinimized$ | async }"
          (click)="toggleLeftSidebar(true)"
        ></div>
      </main>
      <!--      <section class="app-messages" *ngIf="showDebug$ | async"></section> -->
    </section>
  `,
  styles: [],
  animations: [privateRouterTransition]
})
export class PrivateViewComponent implements OnInit {
  leftSidebarMinimized$: Observable<boolean>;
  rightSidebarMinimized$: Observable<boolean>;
  baseUrl: string;
  showDebug$: Observable<boolean>;
  currentUser$: Observable<User>;

  constructor(private router: Router, public mediaquery: MediaqueryService, private store: Store<AppState>) {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.currentUser$ = this.store.pipe(select(currentUser));
    this.leftSidebarMinimized$ = this.store.pipe(select(fromLayout.getLeftSidebarState));
    this.rightSidebarMinimized$ = this.store.pipe(select(fromLayout.getRightSidebarState));
    this.showDebug$ = this.store.pipe(select(isPrivileged('debug-view')));

    if (this.mediaquery.isMobileDevice) {
      this.toggleLeftSidebar(true);
      this.toggleRightSidebar(true);
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
        this.toggleLeftSidebar(true);
        this.toggleRightSidebar(true);
      });
    }
  }

  toggleLeftSidebar(minimized: boolean): void {
    this.store.dispatch(new layoutActions.ToggleLeftSidebar(minimized));
  }

  toggleRightSidebar(minimized: boolean): void {
    this.store.dispatch(new layoutActions.ToggleRightSidebar(minimized));
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
