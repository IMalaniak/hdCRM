import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom, filter, switchMap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { AppState } from '@/core/store';
import { departmentListSchema, departmentSchema, normalizeResponse, Page, partialDataLoaded } from '@/shared/store';
import { ToastMessageService } from '@/shared/services';
import { CollectionApiResponse, ItemApiResponse, BaseMessage, PageQuery } from '@/shared/models';
import { RoutingConstants } from '@/shared/constants';
import { generatePageKey } from '@/shared/utils/generatePageKey';
import * as departmentApiActions from './department-api.actions';
import { selectDashboardDepDataLoaded } from './department-api.selectors';
import { DepartmentService } from '../services';
import { Department } from '../shared/models';

@Injectable()
export class DepartmentEffects {
  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(departmentApiActions.createDepartmentRequested),
      map((payload) => payload.department),
      mergeMap((department: Department) =>
        this.departmentService.create<Department>(this.departmentService.formatBeforeSend(department)).pipe(
          switchMap((response: ItemApiResponse<Department>) => {
            this.toastMessageService.snack(response);
            this.router.navigateByUrl(RoutingConstants.ROUTE_DEPARTMENTS);
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
            this.toastMessageService.snack(errorResponse.error);
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
              const { Departments, Users } = normalizeResponse<Department>(response, departmentSchema);
              response = { ...response, data: Departments[0] };
              const department: Update<Department> = {
                id: response.data.id,
                changes: response.data
              };
              this.toastMessageService.snack(response);
              return [
                departmentApiActions.updateDepartmentSuccess({ department }),
                ...(Users ? [partialDataLoaded({ Users })] : [])
              ];
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              this.toastMessageService.snack(errorResponse.error);
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
            this.toastMessageService.snack(response);
            return departmentApiActions.deleteDepartmentSuccess({ id });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
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
    private actions$: Actions,
    private store$: Store<AppState>,
    private departmentService: DepartmentService,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}
}
