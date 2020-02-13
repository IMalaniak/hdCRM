import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as layoutActions from './layout.actions';
import { map, switchMap } from 'rxjs/operators';
import { LocalStorageService } from '@/_shared/services/local-storage.service';

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions, private localStorage: LocalStorageService) {}

  @Effect()
  toggleLeftSidebar$: Observable<Action> = this.actions$.pipe(
    ofType(layoutActions.LayoutActionTypes.ToggleLeftSidebar),
    map((action: layoutActions.ToggleLeftSidebar) => action.payload),
    switchMap(payload => {
      window.dispatchEvent(new Event('resize'));
      this.localStorage.setObjectKeyValue('layoutSettings', 'hideLeftSidebar', payload);
      return of(new layoutActions.LeftSidebarChangeState(payload));
    })
  );

  @Effect()
  toggleRightSidebar$: Observable<Action> = this.actions$.pipe(
    ofType(layoutActions.LayoutActionTypes.ToggleRightSidebar),
    map((action: layoutActions.ToggleRightSidebar) => action.payload),
    switchMap(payload => {
      window.dispatchEvent(new Event('resize'));
      this.localStorage.setObjectKeyValue('layoutSettings', 'hideRightSidebar', payload);
      return of(new layoutActions.RightSidebarChangeState(payload));
    })
  );

  @Effect()
  init$ = defer(() => {
    const layoutSettings = this.localStorage.getObject('layoutSettings');

    if (!!layoutSettings) {
      return of(new layoutActions.InitLayoutSettings(layoutSettings));
    }
  });
}
