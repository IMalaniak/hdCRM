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
import { ToastMessageService, CollectionApiResponse, ItemApiResponse, ApiResponse } from '@/shared';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DepartmentEffects {
  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.createDepartment),
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
      mergeMap((id) => this.departmentService.getOne(id)),
      map((response: ItemApiResponse<Department>) => depActions.departmentLoaded({ department: response.data })),
      catchError(() => of(depActions.departmentApiError()))
    )
  );

  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.listPageRequested),
      map((payload) => payload.page),
      mergeMap((page) =>
        this.departmentService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          map((response: CollectionApiResponse<Department>) => depActions.listPageLoaded({ response })),
          catchError(() => of(depActions.departmentApiError()))
        )
      )
    )
  );

  deleteDepartment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(depActions.deleteDepartment),
        map((payload) => payload.id),
        mergeMap((id) => this.departmentService.delete(id)),
        map((res: ApiResponse) => this.toastMessageService.snack(res)),
        catchError(() => of(depActions.departmentApiError()))
      ),
    {
      dispatch: false
    }
  );

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.depDashboardDataRequested),
      withLatestFrom(this.store.pipe(select(selectDashboardDepDataLoaded))),
      filter(([_, selectDashboardDepDataLoaded]) => !selectDashboardDepDataLoaded),
      mergeMap(() => this.departmentService.getDashboardData()),
      map((response: CollectionApiResponse<Department>) => depActions.depDashboardDataLoaded({ response })),
      catchError(() => of(depActions.departmentApiError()))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private departmentService: DepartmentService,
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}
}
