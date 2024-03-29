import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect, OnInitEffects } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Action, Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import { MediaQueryService } from '@core/services';
import { LocalStorageService } from '@shared/services';

import * as layoutActions from './layout.actions';
import { LayoutState } from './layout.reducer';
import { getDarkThemeState, tableConfigState } from './layout.selectors';

@Injectable()
export class LayoutEffects implements OnInitEffects {
  navigationEnded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      switchMap(() => of(layoutActions.closeUserDropdown()))
    )
  );

  toggleSidebar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.toggleSidebar),
      map((payload) => payload.minimized),
      switchMap((minimized) => {
        window.dispatchEvent(new Event('resize'));
        if (!this.mediaQueryService.isMobileDevice) {
          this.localStorage.setObjectKeyValue('layoutSettings', 'hideSidebar', minimized);
        }
        return of(layoutActions.sidebarChangeState({ minimized }));
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

  changeTableConfig$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(layoutActions.setTableConfig, layoutActions.removeTableConfig),
        withLatestFrom(this.store$.pipe(select(tableConfigState))),
        map(([_, tConfigState]) => {
          this.localStorage.setObjectKeyValue('layoutSettings', 'tableConfig', tConfigState);
        })
      ),
    {
      dispatch: false
    }
  );

  constructor(
    private actions$: Actions,
    private localStorage: LocalStorageService,
    private overlayContainer: OverlayContainer,
    private mediaQueryService: MediaQueryService,
    private store$: Store<LayoutState>
  ) {}

  ngrxOnInitEffects(): Action {
    let settings: LayoutState = this.localStorage.getObject('layoutSettings');
    if (this.mediaQueryService.isMobileDevice) {
      settings = { ...settings, hideSidebar: true };
    }
    return layoutActions.initLayoutSettings({ settings });
  }
}
