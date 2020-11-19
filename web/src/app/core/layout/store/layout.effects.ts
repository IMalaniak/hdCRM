import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import * as layoutActions from './layout.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { LocalStorageService } from '@/shared/services';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Action, Store, select } from '@ngrx/store';
import { LayoutState } from './layout.reducer';
import { getDarkThemeState } from './index';
import { MediaQueryService } from '@/core/services';

@Injectable()
export class LayoutEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private localStorage: LocalStorageService,
    private overlayContainer: OverlayContainer,
    private mediaQueryService: MediaQueryService,
    private store$: Store<LayoutState>
  ) {}

  toggleLeftSidebar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.toggleLeftSidebar),
      map((payload) => payload.minimized),
      switchMap((minimized) => {
        window.dispatchEvent(new Event('resize'));
        if (!this.mediaQueryService.isMobileDevice) {
          this.localStorage.setObjectKeyValue('layoutSettings', 'hideLeftSidebar', minimized);
        }
        return of(layoutActions.leftSidebarChangeState({ minimized }));
      })
    )
  );

  toggleRightSidebar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.toggleRightSidebar),
      map((payload) => payload.minimized),
      switchMap((minimized) => {
        window.dispatchEvent(new Event('resize'));
        if (!this.mediaQueryService.isMobileDevice) {
          this.localStorage.setObjectKeyValue('layoutSettings', 'hideRightSidebar', minimized);
        }
        return of(layoutActions.rightSidebarChangeState({ minimized }));
      })
    )
  );

  enableDarkTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.enableDarkTheme),
      map((payload) => payload.enabled),
      switchMap((enabled) => {
        this.localStorage.setObjectKeyValue('layoutSettings', 'enableDarkTheme', enabled);
        return of(layoutActions.darkThemeChangeState({ enabled }));
      })
    )
  );

  scaleFontUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.scaleFontUp),
      map((payload) => payload.scaled),
      switchMap((scaled) => {
        this.localStorage.setObjectKeyValue('layoutSettings', 'scaleFontUp', scaled);
        return of(layoutActions.scaleFontUpChangeState({ scaled }));
      })
    )
  );

  darkThemeChangeState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(layoutActions.darkThemeChangeState, layoutActions.initLayoutSettings),
        withLatestFrom(this.store$.pipe(select(getDarkThemeState))),
        map(([_, darkThemeEnabled]) => {
          if (darkThemeEnabled) {
            this.overlayContainer.getContainerElement().classList.add('dark-theme');
          } else {
            this.overlayContainer.getContainerElement().classList.remove('dark-theme');
          }
        })
      ),
    {
      dispatch: false
    }
  );

  ngrxOnInitEffects(): Action {
    let settings: LayoutState = this.localStorage.getObject('layoutSettings');
    if (this.mediaQueryService.isMobileDevice) {
      settings = { ...settings, hideLeftSidebar: true, hideRightSidebar: true };
    }
    return layoutActions.initLayoutSettings({ settings });
  }
}
