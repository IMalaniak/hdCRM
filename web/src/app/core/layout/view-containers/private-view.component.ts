import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { logOut } from '@/core/auth/store/auth.actions';
import { currentUser, isPrivileged } from '@/core/auth/store/auth.selectors';
import { IconsService, MediaQueryService } from '@/core/services';
import { BS_ICONS } from '@/shared/constants';
import { ADD_PRIVILEGES } from '@/shared/constants/privileges.constants';
import { privateRouterTransition } from '@/shared/animations';
import { User } from '@/modules/users';
import * as layoutActions from '../store/layout.actions';
import * as fromLayout from '../store';

@Component({
  template: `
    <section class="grid" [ngClass]="{ 'dark-theme': enableDarkTheme$ | async, 'font-scale': scaleFontUp$ | async }">
      <!-- HEADER -->
      <header-component
        [sidebarMinimized]="sidebarMinimized$ | async"
        [enableDarkTheme]="enableDarkTheme$ | async"
        [currentUser]="currentUser$ | async"
        [canAddUser]="canAddUser$ | async"
        (hideSidebar)="toggleSidebar($event)"
        (enableThemeDark)="enableDarkTheme($event)"
        (logOut)="onLogoutClick()"
      ></header-component>

      <!-- MAIN -->
      <main>
        <!-- SIDEBAR -->
        <sidebar-component [sidebarMinimized]="sidebarMinimized$ | async"></sidebar-component>

        <!-- CONTENT -->
        <section #contentWrapper class="content" [ngClass]="{ 'dark-theme-bg': enableDarkTheme$ | async }">
          <div
            class="overlay"
            *ngIf="mediaQueryService.isMobileDevice"
            [ngClass]="{ isVisible: !(sidebarMinimized$ | async) }"
            (click)="onOverlayClick()"
          ></div>
          <div class="wrapper">
            <section class="container-fluid py-3 position-relative" [@privateRouterAnimations]="prepareRoute(outlet)">
              <router-outlet #outlet="outlet"></router-outlet>
            </section>

            <!-- FOOTER -->
            <footer-component></footer-component>
          </div>
        </section>
      </main>
    </section>
  `,
  animations: [privateRouterTransition],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivateViewComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User> = this.store$.pipe(select(currentUser));
  scaleFontUp$: Observable<boolean> = this.store$.pipe(select(fromLayout.getScalledFontState));
  enableDarkTheme$: Observable<boolean> = this.store$.pipe(select(fromLayout.getDarkThemeState));
  sidebarMinimized$: Observable<boolean> = this.store$.pipe(select(fromLayout.getSidebarState));
  canAddUser$: Observable<boolean> = this.store$.pipe(select(isPrivileged(ADD_PRIVILEGES.USER)));

  @ViewChild('contentWrapper') contentWrapper: ElementRef;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    public mediaQueryService: MediaQueryService,
    private store$: Store<AppState>,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([
      BS_ICONS.ThreeDotsVertical,
      BS_ICONS.PersonPlus,
      BS_ICONS.PersonCheck,
      BS_ICONS.Plus,
      BS_ICONS.Pencil,
      BS_ICONS.X,
      BS_ICONS.Check,
      BS_ICONS.ClipboardCheck,
      BS_ICONS.Upload,
      BS_ICONS.InfoSquare,
      BS_ICONS.Trash,
      BS_ICONS.ArrowsCollapse,
      BS_ICONS.ArrowsExpand,
      BS_ICONS.Flag
    ]);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        if (this.mediaQueryService.isMobileDevice) {
          this.toggleSidebar(true);
        }

        this.contentWrapper.nativeElement.scrollTo(0, 0);
      });
  }

  toggleSidebar(minimized: boolean): void {
    this.store$.dispatch(layoutActions.toggleSidebar({ minimized }));
  }

  enableDarkTheme(enabled: boolean): void {
    this.store$.dispatch(layoutActions.enableDarkTheme({ enabled }));
  }

  scaleFontUp(scaled: boolean): void {
    this.store$.dispatch(layoutActions.scaleFontUp({ scaled }));
  }

  onOverlayClick(): void {
    this.toggleSidebar(true);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  onLogoutClick(): void {
    this.store$.dispatch(logOut());
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
