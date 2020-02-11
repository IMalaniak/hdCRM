import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { defer, of } from 'rxjs';
import * as layoutActions from './layout.actions';
import { switchMap, map } from 'rxjs/operators';
import { LocalStorageService } from '@/_shared/services/local-storage.service';

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
        return of(layoutActions.leftSidebarChangeState({minimized}));
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
        return of(layoutActions.rightSidebarChangeState({minimized}));
      })
    )
  );

  init$ = createEffect(() =>
    defer(() => {
      const settings = this.localStorage.getObject('layoutSettings');

      if (!!settings) {
        return of(layoutActions.initLayoutSettings({settings}));
      }
    })
  );
}
