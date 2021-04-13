import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/store';
import { IconsService, MediaQueryService } from '@/core/services';
import { BS_ICON } from '@/shared/constants';
import { privateRouterTransition } from '@/shared/animations';

import * as layoutActions from '../store/layout.actions';
import * as fromLayout from '../store';

@Component({
  template: `
    <section class="grid" [ngClass]="{ 'dark-theme': enableDarkTheme$ | async, 'font-scale': scaleFontUp$ | async }">
      <!-- HEADER -->
      <header-component
        [sidebarMinimized]="sidebarMinimized$ | async"
        [enableDarkTheme]="enableDarkTheme$ | async"
        (hideSidebar)="toggleSidebar($event)"
        (enableThemeDark)="enableDarkTheme($event)"
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
            [ngClass]="{ isVisible: (sidebarMinimized$ | async) === false }"
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
  @ViewChild('contentWrapper') contentWrapper: ElementRef;

  scaleFontUp$: Observable<boolean> = this.store$.pipe(select(fromLayout.getScalledFontState));
  enableDarkTheme$: Observable<boolean> = this.store$.pipe(select(fromLayout.getDarkThemeState));
  sidebarMinimized$: Observable<boolean> = this.store$.pipe(select(fromLayout.getSidebarState));

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    public mediaQueryService: MediaQueryService,
    private store$: Store<AppState>,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([
      BS_ICON.ThreeDotsVertical,
      BS_ICON.PersonPlus,
      BS_ICON.PersonCheck,
      BS_ICON.Plus,
      BS_ICON.Pencil,
      BS_ICON.X,
      BS_ICON.Check,
      BS_ICON.ClipboardCheck,
      BS_ICON.Upload,
      BS_ICON.InfoSquare,
      BS_ICON.Trash,
      BS_ICON.ArrowsCollapse,
      BS_ICON.ArrowsExpand,
      BS_ICON.Flag
    ]);
  }

  ngOnInit(): void {
    // TODO: @IMalaniak check if can be implemented with ngrx router actions
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
