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
  toogleSidebar$: Observable<Action> = this.actions$.pipe(
    ofType(layoutActions.LayoutActionTypes.ToggleSidebar),
    map((action: layoutActions.ToggleSidebar) => action.payload),
    switchMap(payload => {
      window.dispatchEvent(new Event('resize'));
      localStorage.setItem('sidebarMinimized', JSON.stringify(payload));
      return of(new layoutActions.SidebarChangeState(payload));
    })
  );

  @Effect()
  init$ = defer(() => {
    const sideBarState = localStorage.getItem('sidebarMinimized');
    if (sideBarState) {
      return of(new layoutActions.SidebarChangeState(JSON.parse(sideBarState)));
    }
  });
}
