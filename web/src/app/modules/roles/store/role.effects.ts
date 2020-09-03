import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as roleActions from './role.actions';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { RoleService } from '../services';
import { AppState } from '@/core/reducers';
import { Role } from '../models';
import { selectRolesDashboardDataLoaded } from './role.selectors';
import { Router } from '@angular/router';
import { ToastMessageService } from '@/shared/services';
import { CollectionApiResponse, ItemApiResponse, ApiResponse } from '@/shared/models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RoleEffects {
  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.createRole),
      map((payload) => payload.role),
      mergeMap((role: Role) =>
        this.roleService.create({ ...role }).pipe(
          map((response: ItemApiResponse<Role>) => {
            this.toastMessageService.snack(response);
            this.router.navigate(['/roles']);
            return roleActions.createRoleSuccess({ role: response.data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(roleActions.rolesApiError());
          })
        )
      )
    )
  );

  loadRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.roleRequested),
      map((payload) => payload.id),
      mergeMap((id) => this.roleService.getRole(id)),
      map((response: ItemApiResponse<Role>) => roleActions.roleLoaded({ role: response.data })),
      catchError(() => of(roleActions.rolesApiError()))
    )
  );

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((page) =>
        this.roleService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: CollectionApiResponse<Role>) => roleActions.listPageLoaded({ response })),
          catchError(() => of(roleActions.rolesApiError()))
        )
      )
    )
  );

  // TODO: @IMalaniak recreate this
  deleteRole$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(roleActions.deleteRole),
        map((payload) => payload.id),
        mergeMap((id) => this.roleService.delete(id)),
        map((response: ApiResponse) => of(this.toastMessageService.snack(response))),
        catchError(() => of(roleActions.rolesApiError()))
      ),
    {
      dispatch: false
    }
  );

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.roleDashboardDataRequested),
      withLatestFrom(this.store.pipe(select(selectRolesDashboardDataLoaded))),
      filter(([_, rolesDashboardDataLoaded]) => !rolesDashboardDataLoaded),
      mergeMap(() => this.roleService.getDashboardData()),
      map((response) => roleActions.roleDashboardDataLoaded({ response })),
      catchError(() => of(roleActions.rolesApiError()))
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
