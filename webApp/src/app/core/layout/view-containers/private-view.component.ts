import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable, Subject } from 'rxjs';
import { User } from '@/modules/users';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import * as layoutActions from '../store/layout.actions';
import * as fromLayout from '../store';
import { privateRouterTransition, MediaqueryService } from '@/shared';

@Component({
  selector: 'app-private',
  template: `
    <section class="grid" [ngClass]="{ 'dark-theme': themeModeSwitched$ | async }">
      <app-header
        [leftSidebarMinimized]="leftSidebarMinimized$ | async"
        [currentUser]="currentUser$ | async"
        (hideLeftSidebar)="toggleLeftSidebar($event)"
      ></app-header>
      <main>
        <app-left-sidebar [leftSidebarMinimized]="leftSidebarMinimized$ | async"></app-left-sidebar>
        <section class="content">
          <div
            class="overlay"
            *ngIf="mediaquery.isMobileDevice"
            [ngClass]="{ isVisible: !(leftSidebarMinimized$ | async) || !(rightSidebarMinimized$ | async) }"
            (click)="onOverlayClick()"
          ></div>
          <div class="wrapper">
            <section class="container-fluid position-relative" [@privateRouterAnimations]="prepareRoute(outlet)">
              <router-outlet #outlet="outlet"></router-outlet>
            </section>
            <app-footer></app-footer>
          </div>
          <app-right-sidebar
            [rightSidebarMinimized]="rightSidebarMinimized$ | async"
            [themeModeSwitched]="themeModeSwitched$ | async"
            [fontResized]="fontResized$ | async"
            (hideRightSidebar)="toggleRightSidebar($event)"
            (switchThemeMode)="toogleThemeMode($event)"
            (resizeFont)="toogleFontSize($event)"
          ></app-right-sidebar>
        </section>
      </main>
      <!--      <section class="app-messages" *ngIf="showDebug$ | async"></section> -->
    </section>
  `,
  animations: [privateRouterTransition]
})
export class PrivateViewComponent implements OnInit, OnDestroy {
  leftSidebarMinimized$: Observable<boolean>;
  rightSidebarMinimized$: Observable<boolean>;
  themeModeSwitched$: Observable<boolean>;
  fontResized$: Observable<boolean>;
  showDebug$: Observable<boolean>;
  currentUser$: Observable<User>;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private router: Router, public mediaquery: MediaqueryService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.pipe(select(currentUser));
    this.leftSidebarMinimized$ = this.store.pipe(select(fromLayout.getLeftSidebarState));
    this.rightSidebarMinimized$ = this.store.pipe(select(fromLayout.getRightSidebarState));
    this.themeModeSwitched$ = this.store.pipe(select(fromLayout.getThemeModeState));
    this.fontResized$ = this.store.pipe(select(fromLayout.getFontState));
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
    this.store.dispatch(layoutActions.toggleLeftSidebar({ minimized }));
  }

  toggleRightSidebar(minimized: boolean): void {
    this.store.dispatch(layoutActions.toggleRightSidebar({ minimized }));
  }

  toogleThemeMode(switched: boolean): void {
    this.store.dispatch(layoutActions.toogleThemeMode({ switched }));
  }

  toogleFontSize(resized: boolean): void {
    this.store.dispatch(layoutActions.toogleFontSize({ resized }));
  }

  onOverlayClick(): void {
    this.toggleLeftSidebar(true);
    this.toggleRightSidebar(true);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
