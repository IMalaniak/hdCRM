import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable, Subject } from 'rxjs';
import { User } from '@/modules/users';
import { currentUser } from '@/core/auth/store/auth.selectors';
import * as layoutActions from '../store/layout.actions';
import * as fromLayout from '../store';
import { MediaqueryService } from '@/shared/services';
import { privateRouterTransition } from '@/shared/animations';

@Component({
  selector: 'app-private',
  template: `
    <section class="grid" [ngClass]="{ 'dark-theme': enableDarkTheme$ | async, 'font-scale': scaleFontUp$ | async }">
      <header-component
        [leftSidebarMinimized]="leftSidebarMinimized$ | async"
        [enableDarkTheme]="enableDarkTheme$ | async"
        [currentUser]="currentUser$ | async"
        (hideLeftSidebar)="toggleLeftSidebar($event)"
        (enableThemeDark)="enableDarkTheme($event)"
      ></header-component>
      <main>
        <left-sidebar [leftSidebarMinimized]="leftSidebarMinimized$ | async"></left-sidebar>
        <section #contentWrapper class="content" [ngClass]="{ 'dark-theme-bg': enableDarkTheme$ | async }">
          <div
            class="overlay"
            *ngIf="mediaquery.isMobileDevice"
            [ngClass]="{ isVisible: !(leftSidebarMinimized$ | async) || !(rightSidebarMinimized$ | async) }"
            (click)="onOverlayClick()"
          ></div>
          <div class="wrapper">
            <section class="container-fluid py-3 position-relative" [@privateRouterAnimations]="prepareRoute(outlet)">
              <router-outlet #outlet="outlet"></router-outlet>
            </section>
            <footer-component></footer-component>
          </div>
          <right-sidebar
            [rightSidebarMinimized]="rightSidebarMinimized$ | async"
            [scaleFontUp]="scaleFontUp$ | async"
            (hideRightSidebar)="toggleRightSidebar($event)"
            (scaleUpFont)="scaleFontUp($event)"
          ></right-sidebar>
        </section>
      </main>
    </section>
  `,
  animations: [privateRouterTransition],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivateViewComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User> = this.store.pipe(select(currentUser));
  scaleFontUp$: Observable<boolean> = this.store.pipe(select(fromLayout.getScalledFontState));
  enableDarkTheme$: Observable<boolean> = this.store.pipe(select(fromLayout.getDarkThemeState));
  leftSidebarMinimized$: Observable<boolean> = this.store.pipe(select(fromLayout.getLeftSidebarState));
  rightSidebarMinimized$: Observable<boolean> = this.store.pipe(select(fromLayout.getRightSidebarState));

  @ViewChild('contentWrapper', { static: false })
  contentWrapper: ElementRef;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private router: Router, public mediaquery: MediaqueryService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        if (this.mediaquery.isMobileDevice) {
          this.toggleLeftSidebar(true);
          this.toggleRightSidebar(true);
        }

        this.contentWrapper.nativeElement.scrollTo(0, 0);
      });
  }

  toggleLeftSidebar(minimized: boolean): void {
    this.store.dispatch(layoutActions.toggleLeftSidebar({ minimized }));
  }

  toggleRightSidebar(minimized: boolean): void {
    this.store.dispatch(layoutActions.toggleRightSidebar({ minimized }));
  }

  enableDarkTheme(enabled: boolean): void {
    this.store.dispatch(layoutActions.enableDarkTheme({ enabled }));
  }

  scaleFontUp(scaled: boolean): void {
    this.store.dispatch(layoutActions.scaleFontUp({ scaled }));
  }

  onOverlayClick(): void {
    this.toggleLeftSidebar(true);
    this.toggleRightSidebar(true);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
