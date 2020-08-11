import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as roleActions from './role.actions';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { RoleService } from '../services';
import { AppState } from '@/core/reducers';
import { RoleServerResponse, Role } from '../models';
import { selectRolesDashboardDataLoaded } from './role.selectors';
import { Router } from '@angular/router';
import { ToastMessageService } from '@/shared/services';

@Injectable()
export class RoleEffects {
  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.createRole),
      map(payload => payload.role),
      mergeMap((role: Role) =>
        this.roleService.create({ ...role }).pipe(
          map(newRole => {
            this.toastMessageService.popup('Role created!', 'success', 1500);
            this.router.navigate(['/roles']);
            return roleActions.createRoleSuccess({ role: newRole });
          }),
          catchError(error => {
            this.toastMessageService.popup('Ooops, something went wrong!', 'error', 1500);
            return of(roleActions.createRoleFail({ error }));
          })
        )
      )
    )
  );

  loadRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.roleRequested),
      map(payload => payload.id),
      mergeMap(id => this.roleService.getRole(id)),
      map(role => roleActions.roleLoaded({ role }))
    )
  );

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.listPageRequested),
      map(payload => payload.page),
      mergeMap(page =>
        this.roleService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: RoleServerResponse) => roleActions.listPageLoaded({ response })),
          catchError(err => of(roleActions.listPageCancelled()))
        )
      )
    )
  );

  deleteRole$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(roleActions.deleteRole),
        map(payload => payload.id),
        mergeMap(id => this.roleService.delete(id)),
        map(() => of(this.toastMessageService.toast('Role deleted!', 'success')))
      ),
    {
      dispatch: false
    }
  );

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.roleDashboardDataRequested),
      withLatestFrom(this.store.pipe(select(selectRolesDashboardDataLoaded))),
      filter(([action, rolesDashboardDataLoaded]) => !rolesDashboardDataLoaded),
      mergeMap(() => this.roleService.getDashboardData()),
      map(response => roleActions.roleDashboardDataLoaded({ response })),
      catchError(err => {
        return throwError(err);
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private roleService: RoleService,
    private toastMessageService: ToastMessageService
  ) {}
}
