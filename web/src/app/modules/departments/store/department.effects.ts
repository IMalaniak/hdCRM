import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as depActions from './department.actions';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { DepartmentService } from '../services';
import { AppState } from '@/core/reducers';
import { Department } from '../models';
import { selectDashboardDepDataLoaded } from './department.selectors';
import { Router } from '@angular/router';
import { ToastMessageService } from '@/shared/services';
import { CollectionApiResponse, ItemApiResponse, ApiResponse, PageQuery } from '@/shared/models';
import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';

@Injectable()
export class DepartmentEffects {
  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.createDepartmentRequested),
      map((payload) => payload.department),
      mergeMap((department: Department) =>
        this.departmentService.create(department).pipe(
          map((response: ItemApiResponse<Department>) => {
            this.toastMessageService.snack(response);
            this.router.navigate(['/departments']);
            return depActions.createDepartmentSuccess({
              department: response.data
            });
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
      mergeMap((id: number) => this.departmentService.getOne(id)),
      map((response: ItemApiResponse<Department>) => depActions.departmentLoaded({ department: response.data })),
      catchError(() => of(depActions.departmentApiError()))
    )
  );

  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((page: PageQuery) =>
        this.departmentService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: CollectionApiResponse<Department>) => depActions.listPageLoaded({ response })),
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
        this.departmentService.updateOne(department).pipe(
          map((response: ItemApiResponse<Department>) => {
            const department: Update<Department> = {
              id: response.data.id,
              changes: response.data
            };
            this.toastMessageService.snack(response);
            return depActions.updateDepartmentSuccess({ department });
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
          map((response: ApiResponse) => {
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
      map((response: CollectionApiResponse<Department>) => depActions.depDashboardDataLoaded({ response })),
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
