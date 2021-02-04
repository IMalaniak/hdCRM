import { Injectable } from '@angular/core';
import { withLatestFrom, switchMap, map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { AppState } from '@/core/store';
import { Department } from '@/core/modules/department-api/shared';
import * as departmentApiActions from '@/core/modules/department-api/store/department-api.actions';
import { selectDepartmentById } from '@/core/modules/department-api/store';
import * as departmentActions from './department.actions';
import { selectDepartmentFromCache } from './department.selectors';

@Injectable()
export class DepartmentEffects {
  cacheDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentActions.cacheDepartment),
      map((payload) => payload.id),
      switchMap((id: number) =>
        this.store$
          .pipe(select(selectDepartmentById(id)))
          .pipe(map((displayedItemCopy) => departmentActions.departmentCached({ displayedItemCopy })))
      )
    )
  );

  restoreDepartmentFromCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentActions.restoreFromCache),
      withLatestFrom(this.store$.pipe(select(selectDepartmentFromCache))),
      switchMap(([_, departmentCopy]) => {
        const department: Update<Department> = {
          id: departmentCopy.id,
          changes: departmentCopy
        };
        return [departmentApiActions.updateDepartmentSuccess({ department })];
      })
    )
  );

  constructor(private readonly actions$: Actions, private readonly store$: Store<AppState>) {}
}
