import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaqueryService } from '@/_shared/services';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable, Subject } from 'rxjs';
import { User } from '@/_modules/users';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import * as layoutActions from '../store/layout.actions';
import * as fromLayout from '../store/';
import { privateRouterTransition } from '@/_shared/animations/private-router-transition';
import { SocketService } from '@/_shared/services/socket.service';
import { SocketEvent } from '@/_shared/models/socketEvent';

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

export class PrivateViewComponent implements OnInit, OnDestroy {
  leftSidebarMinimized$: Observable<boolean>;
  rightSidebarMinimized$: Observable<boolean>;
  showDebug$: Observable<boolean>;
  currentUser$: Observable<User>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private router: Router, public mediaquery: MediaqueryService, private store: Store<AppState>, private socket: SocketService) {
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
    this.currentUser$.pipe(take(1)).subscribe(user => {
      this.socket.emit(SocketEvent.ISONLINE, {
        id: user.id,
        name: user.name,
        surname: user.surname,
        avatar: user.avatar,
        OrganizationId: user.OrganizationId
      });
      // this.socket.emit(SocketEvent.INITMODULE, {moduleName: 'notifications'});
    });
  }

  toggleLeftSidebar(minimized: boolean): void {
    this.store.dispatch(layoutActions.toggleLeftSidebar({minimized}));
  }

  toggleRightSidebar(minimized: boolean): void {
    this.store.dispatch(layoutActions.toggleRightSidebar({minimized}));
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
