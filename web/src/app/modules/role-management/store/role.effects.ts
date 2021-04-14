import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { withLatestFrom, switchMap, map } from 'rxjs/operators';

import { Role } from '@core/modules/role-api/shared';
import { selectRoleById } from '@core/modules/role-api/store/role';
import * as roleApiActions from '@core/modules/role-api/store/role/role.actions';
import { AppState } from '@core/store';

import * as roleActions from './role.actions';
import { selectRoleFromCache } from './role.selectors';

@Injectable()
export class RoleEffects {
  cacheRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.cacheRole),
      map((payload) => payload.id),
      switchMap((id: number) =>
        this.store$
          .pipe(select(selectRoleById(id)))
          .pipe(map((displayedItemCopy) => roleActions.roleCached({ displayedItemCopy })))
      )
    )
  );

  restoreRoleFromCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.restoreFromCache),
      withLatestFrom(this.store$.pipe(select(selectRoleFromCache))),
      switchMap(([_, roleCopy]) => {
        const role: Update<Role> = {
          id: roleCopy.id,
          changes: roleCopy
        };
        return [roleApiActions.updateRoleSuccess({ role })];
      })
    )
  );

  constructor(private readonly actions$: Actions, private readonly store$: Store<AppState>) {}
}
