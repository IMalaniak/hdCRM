import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, defer, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as layoutActions from './layout.actions';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class LayoutEffects {
  constructor(private actions$: Actions) {}

  @Effect()
  toggleLeftSidebar$: Observable<Action> = this.actions$.pipe(
    ofType(layoutActions.LayoutActionTypes.ToggleLeftSidebar),
    map((action: layoutActions.ToggleLeftSidebar) => action.payload),
    switchMap(payload => {
      window.dispatchEvent(new Event('resize'));
      localStorage.setItem('leftSidebarMinimized', JSON.stringify(payload));
      return of(new layoutActions.LeftSidebarChangeState(payload));
    })
  );

  @Effect()
  toggleRightSidebar$: Observable<Action> = this.actions$.pipe(
    ofType(layoutActions.LayoutActionTypes.ToggleRightSidebar),
    map((action: layoutActions.ToggleRightSidebar) => action.payload),
    switchMap(payload => {
      window.dispatchEvent(new Event('resize'));
      localStorage.setItem('rightSidebarMinimized', JSON.stringify(payload));
      return of(new layoutActions.RightSidebarChangeState(payload));
    })
  );

  @Effect()
  init$ = defer(() => {
    const leftSidebarState = localStorage.getItem('leftSidebarMinimized');
    const rightSidebarState = localStorage.getItem('rightSidebarMinimized');

    if (!!leftSidebarState) {
      return of(new layoutActions.LeftSidebarChangeState(JSON.parse(leftSidebarState)));
    }
    if (!!rightSidebarState) {
      return of(new layoutActions.RightSidebarChangeState(JSON.parse(rightSidebarState)));
    }
  });
}
