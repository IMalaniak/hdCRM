import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, map, catchError, withLatestFrom, filter, switchMap } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { AppState } from '@/core/reducers';
import { departmentListSchema, departmentSchema, normalizeResponse, Page, partialDataLoaded } from '@/shared/store';
import * as depActions from './department.actions';
import { DepartmentService } from '../services';
import { Department } from '../models';
import { selectDashboardDepDataLoaded } from './department.selectors';
import { ToastMessageService } from '@/shared/services';
import { CollectionApiResponse, ItemApiResponse, BaseMessage, PageQuery } from '@/shared/models';
import { RoutingConstants } from '@/shared/constants';
import { generatePageKey } from '@/shared/utils/generatePageKey';

@Injectable()
export class DepartmentEffects {
  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.createDepartmentRequested),
      map((payload) => payload.department),
      mergeMap((department: Department) =>
        this.departmentService.create<Department>(this.departmentService.formatBeforeSend(department)).pipe(
          switchMap((response: ItemApiResponse<Department>) => {
            this.toastMessageService.snack(response);
            this.router.navigateByUrl(RoutingConstants.ROUTE_DEPARTMENTS);
            const { Departments, Users } = normalizeResponse<Department>(response, departmentSchema);
            response = { ...response, data: Departments[0] };
            return [
              depActions.createDepartmentSuccess({
                department: response.data
              }),
              partialDataLoaded({ Users })
            ];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(depActions.departmentApiError());
          })
        )
      )
    )
  );

  loadDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.departmentRequested),
      map((payload) => payload.id),
      mergeMap((id: number) => this.departmentService.get<Department>(id)),
      switchMap((response: ItemApiResponse<Department>) => {
        const { Departments, Users } = normalizeResponse<Department>(response, departmentSchema);
        response = { ...response, data: Departments[0] };
        return [depActions.departmentLoaded({ department: response.data }), partialDataLoaded({ Users })];
      }),
      catchError(() => of(depActions.departmentApiError()))
    )
  );

  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((pageQuery: PageQuery) =>
        this.departmentService.getItems<Department>(pageQuery).pipe(
          switchMap((response: CollectionApiResponse<Department>) => {
            const page: Page = { dataIds: response.ids, key: generatePageKey(pageQuery) };
            const { Departments, Users } = normalizeResponse<Department>(response, departmentListSchema);
            response = { ...response, data: Departments };
            return [depActions.listPageLoaded({ response, page }), partialDataLoaded({ Users })];
          }),
          catchError(() => of(depActions.departmentApiError()))
        )
      )
    )
  );

  updateDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.updateDepartmentRequested),
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
              return [depActions.updateDepartmentSuccess({ department }), partialDataLoaded({ Users })];
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              this.toastMessageService.snack(errorResponse.error);
              return of(depActions.departmentApiError());
            })
          )
      )
    )
  );

  deleteDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.deleteDepartmentRequested),
      map((payload) => payload.id),
      mergeMap((id: number) =>
        this.departmentService.delete(id).pipe(
          map((response: BaseMessage) => {
            this.toastMessageService.snack(response);
            return depActions.deleteDepartmentSuccess({ id });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toastMessageService.snack(errorResponse.error);
            return of(depActions.departmentApiError());
          })
        )
      )
    )
  );

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.depDashboardDataRequested),
      withLatestFrom(this.store$.pipe(select(selectDashboardDepDataLoaded))),
      filter(([_, selectDashboardDepDataLoaded]) => !selectDashboardDepDataLoaded),
      mergeMap(() => this.departmentService.getDashboardData()),
      switchMap((response: CollectionApiResponse<Department>) => {
        const { Departments, Users } = normalizeResponse<Department>(response, departmentListSchema);
        response = { ...response, data: Departments };
        return [depActions.depDashboardDataLoaded({ response }), partialDataLoaded({ Users })];
      }),
      catchError(() => of(depActions.departmentApiError()))
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
