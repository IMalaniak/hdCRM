import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom, filter, switchMap } from 'rxjs/operators';

import { AppState } from '@core/store';
import {
  departmentListSchema,
  departmentSchema,
  normalizeResponse,
  partialDataLoaded
} from '@core/store/normalization';
import { RoutingConstants } from '@shared/constants';
import { CollectionApiResponse, ItemApiResponse, BaseMessage, PageQuery } from '@shared/models';
import { ToastMessageService } from '@shared/services';
import { Page } from '@shared/store';
import { generatePageKey } from '@shared/utils/generatePageKey';

import { DepartmentService } from '../services';
import { Department } from '../shared/models';

import * as departmentApiActions from './department-api.actions';
import { selectDashboardDepDataLoaded } from './department-api.selectors';

@Injectable()
export class DepartmentEffects {
  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentApiActions.createDepartmentRequested),
      map((payload) => payload.department),
      mergeMap((department: Department) =>
        this.departmentService.create<Department>(this.departmentService.formatBeforeSend(department)).pipe(
          switchMap((response: ItemApiResponse<Department>) => {
            this.toastMessageService.success(response.message);
            this.router.navigateByUrl(RoutingConstants.ROUTE_DEPARTMENTS);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { Departments, Users } = normalizeResponse<Department>(response, departmentSchema);
            response = { ...response, data: Departments[0] };
            return [
              departmentApiActions.createDepartmentSuccess({
                department: response.data
              }),
              ...(Users ? [partialDataLoaded({ Users })] : [])
            ];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
            return of(departmentApiActions.departmentApiError());
          })
        )
      )
    )
  );

  loadDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentApiActions.departmentRequested),
      map((payload) => payload.id),
      mergeMap((id: number) => this.departmentService.getOne<Department>(id)),
      switchMap((response: ItemApiResponse<Department>) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { Departments, Users } = normalizeResponse<Department>(response, departmentSchema);
        response = { ...response, data: Departments[0] };
        return [
          departmentApiActions.departmentLoaded({ department: response.data }),
          ...(Users ? [partialDataLoaded({ Users })] : [])
        ];
      }),
      catchError(() => of(departmentApiActions.departmentApiError()))
    )
  );

  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentApiActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((pageQuery: PageQuery) =>
        this.departmentService.getList<Department>(pageQuery).pipe(
          switchMap((response: CollectionApiResponse<Department>) => {
            const page: Page = { dataIds: response.ids, key: generatePageKey(pageQuery) };
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const { Departments, Users } = normalizeResponse<Department>(response, departmentListSchema);
            if (!Departments) {
              return EMPTY;
            }
            response = { ...response, data: Departments };
            return [
              departmentApiActions.listPageLoaded({ response, page }),
              ...(Users ? [partialDataLoaded({ Users })] : [])
            ];
          }),
          catchError(() => of(departmentApiActions.departmentApiError()))
        )
      )
    )
  );

  updateDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentApiActions.updateDepartmentRequested),
      map((payload) => payload.department),
      mergeMap((department: Department) =>
        this.departmentService
          .update<Department>(this.departmentService.formatBeforeSend(department), department.id)
          .pipe(
            switchMap((response: ItemApiResponse<Department>) => {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              const { Departments, Users } = normalizeResponse<Department>(response, departmentSchema);
              response = { ...response, data: Departments[0] };
              const department: Update<Department> = {
                id: response.data.id,
                changes: response.data
              };
              this.toastMessageService.success(response.message);
              return [
                departmentApiActions.updateDepartmentSuccess({ department }),
                ...(Users ? [partialDataLoaded({ Users })] : [])
              ];
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              this.toastMessageService.error(errorResponse.error.message);
              return of(departmentApiActions.departmentApiError());
            })
          )
      )
    )
  );

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentApiActions.deleteDepartmentRequested),
      map((payload) => payload.id),
      mergeMap((id: number) =>
        this.departmentService.delete(id).pipe(
          map((response: BaseMessage) => {
            this.toastMessageService.success(response.message);
            return departmentApiActions.deleteDepartmentSuccess({ id });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.error(errorResponse.error.message);
            return of(departmentApiActions.departmentApiError());
          })
        )
      )
    )
  );

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentApiActions.depDashboardDataRequested),
      withLatestFrom(this.store$.pipe(select(selectDashboardDepDataLoaded))),
      filter(([_, selectDashboardDepDataLoaded]) => !selectDashboardDepDataLoaded),
      mergeMap(() => this.departmentService.getDashboardData()),
      switchMap((response: CollectionApiResponse<Department>) => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { Departments, Users } = normalizeResponse<Department>(response, departmentListSchema);
        if (!Departments) {
          return EMPTY;
        }
        response = { ...response, data: Departments };
        return [
          departmentApiActions.depDashboardDataLoaded({ response }),
          ...(Users ? [partialDataLoaded({ Users })] : [])
        ];
      }),
      catchError(() => of(departmentApiActions.departmentApiError()))
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<AppState>,
    private readonly departmentService: DepartmentService,
    private readonly router: Router,
    private readonly toastMessageService: ToastMessageService
  ) {}
}
