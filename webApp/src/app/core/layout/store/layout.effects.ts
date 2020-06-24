import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { defer, of } from 'rxjs';
import * as layoutActions from './layout.actions';
import { switchMap, map } from 'rxjs/operators';
import { LocalStorageService } from '@/shared';

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions, private localStorage: LocalStorageService) {}

  toggleLeftSidebar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.toggleLeftSidebar),
      map(payload => payload.minimized),
      switchMap(minimized => {
        window.dispatchEvent(new Event('resize'));
        this.localStorage.setObjectKeyValue('layoutSettings', 'hideLeftSidebar', minimized);
        return of(layoutActions.leftSidebarChangeState({ minimized }));
      })
    )
  );

  toggleRightSidebar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.toggleRightSidebar),
      map(payload => payload.minimized),
      switchMap(minimized => {
        window.dispatchEvent(new Event('resize'));
        this.localStorage.setObjectKeyValue('layoutSettings', 'hideRightSidebar', minimized);
        return of(layoutActions.rightSidebarChangeState({ minimized }));
      })
    )
  );

  toogleThemeMode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.toogleThemeMode),
      map(payload => payload.switched),
      switchMap(switched => {
        this.localStorage.setObjectKeyValue('layoutSettings', 'darkThemeEnabled', switched);
        return of(layoutActions.themeModeChangeState({ switched }));
      })
    )
  );

  toogleFontSize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(layoutActions.toogleFontSize),
      map(payload => payload.resized),
      switchMap(resized => {
        this.localStorage.setObjectKeyValue('layoutSettings', 'fontScaleEnabled', resized);
        return of(layoutActions.fontSizeChangeState({ resized }));
      })
    )
  );

  init$ = createEffect(() =>
    defer(() => {
      const settings = this.localStorage.getObject('layoutSettings');

      if (!!settings) {
        return of(layoutActions.initLayoutSettings({ settings }));
      }
    })
  );
}
