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
import { Update } from '@ngrx/entity';
import { RoutingConstants } from '@/shared/constants';

@Injectable()
export class RoleEffects {
  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.createRoleRequested),
      map((payload) => payload.role),
      mergeMap((role: Role) =>
        this.roleService.create({ ...role }).pipe(
          map((response: ItemApiResponse<Role>) => {
            this.toastMessageService.snack(response);
            this.router.navigateByUrl(RoutingConstants.ROUTE_ROLES);
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

  updateRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.updateRoleRequested),
      map((payload) => payload.role),
      mergeMap((role: Role) =>
        this.roleService.updateRole(role).pipe(
          map((response: ItemApiResponse<Role>) => {
            const role: Update<Role> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.snack(response);
            return roleActions.updateRoleSuccess({ role });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(roleActions.rolesApiError());
          })
        )
      )
    )
  );

  deleteRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.deleteRoleRequested),
      map((payload) => payload.id),
      mergeMap((id: number) =>
        this.roleService.delete(id).pipe(
          map((response: ApiResponse) => {
            this.toastMessageService.snack(response);
            return roleActions.deleteRoleSuccess({ id });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(roleActions.rolesApiError());
          })
        )
      )
    )
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
