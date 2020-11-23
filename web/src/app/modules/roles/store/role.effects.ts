import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom, filter, switchMap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import { AppState } from '@/core/reducers';
import { ToastMessageService } from '@/shared/services';
import { APIS, RoutingConstants } from '@/shared/constants';
import { normalizeResponse, Page, partialDataLoaded, roleListSchema, roleSchema } from '@/shared/store';
import { CollectionApiResponse, ItemApiResponse, BaseMessage } from '@/shared/models';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as roleActions from './role.actions';
import { RoleService } from '../services';
import { Role } from '../models';
import { selectRolesDashboardDataLoaded } from './role.selectors';

@Injectable()
export class RoleEffects {
  createRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.createRoleRequested),
      map((payload) => payload.role),
      mergeMap((role: Role) =>
        this.roleService.create<Role>(this.roleService.formatBeforeSend({ ...role })).pipe(
          switchMap((response: ItemApiResponse<Role>) => {
            this.toastMessageService.snack(response);
            this.router.navigateByUrl(RoutingConstants.ROUTE_ROLES);
            const { Users, Roles } = normalizeResponse<Role>(response, roleSchema);
            response = { ...response, data: Roles[0] };
            return [roleActions.createRoleSuccess({ role: response.data }), partialDataLoaded({ Users })];
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
      mergeMap((id) => this.roleService.getOne<Role>(id)),
      switchMap((response: ItemApiResponse<Role>) => {
        const { Users, Roles } = normalizeResponse<Role>(response, roleSchema);
        response = { ...response, data: Roles[0] };
        return [roleActions.roleLoaded({ role: response.data }), partialDataLoaded({ Users })];
      }),
      catchError(() => of(roleActions.rolesApiError()))
    )
  );

  loadRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(roleActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((pageQuery) =>
        this.roleService.getList<Role>(pageQuery).pipe(
          switchMap((response: CollectionApiResponse<Role>) => {
            const page: Page = { dataIds: response.ids, key: generatePageKey(pageQuery) };
            const { Users, Roles } = normalizeResponse<Role>(response, roleListSchema);
            response = { ...response, data: Roles };
            return [roleActions.listPageLoaded({ response, page }), partialDataLoaded({ Users })];
          }),
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
        this.roleService.update<Role>(this.roleService.formatBeforeSend(role), role.id).pipe(
          switchMap((response: ItemApiResponse<Role>) => {
            const { Users, Roles } = normalizeResponse<Role>(response, roleSchema);
            response = { ...response, data: Roles[0] };
            const role: Update<Role> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.snack(response);
            return [roleActions.updateRoleSuccess({ role }), partialDataLoaded({ Users })];
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
          map((response: BaseMessage) => {
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
      withLatestFrom(this.store$.pipe(select(selectRolesDashboardDataLoaded))),
      filter(([_, rolesDashboardDataLoaded]) => !rolesDashboardDataLoaded),
      mergeMap(() => this.roleService.getList<Role>(undefined, APIS.ROLES_DASHBOARD)),
      switchMap((response) => {
        const { Users, Roles } = normalizeResponse<Role>(response, roleListSchema);
        response = { ...response, data: Roles };
        return [roleActions.roleDashboardDataLoaded({ response }), partialDataLoaded({ Users })];
      }),
      catchError(() => of(roleActions.rolesApiError()))
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private router: Router,
    private roleService: RoleService,
    private toastMessageService: ToastMessageService
  ) {}
}
