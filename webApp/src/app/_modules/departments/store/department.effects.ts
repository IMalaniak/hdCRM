import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as depActions from './department.actions';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { DepartmentService } from '../_services';
import { AppState } from '@/core/reducers';
import { DepartmentServerResponse, Department } from '../_models';
import { selectDashboardDepDataLoaded } from './department.selectors';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class DepartmentEffects {
  @Effect()
  createDepartment$: Observable<Action> = this.actions$.pipe(
    ofType<depActions.CreateDepartment>(depActions.DepartmentActionTypes.DEPARTMENT_CREATE),
    map((action: depActions.CreateDepartment) => action.payload.department),
    mergeMap((department: Department) =>
      this.departmentService.create({ ...department }).pipe(
        map(newDepartment => {
          Swal.fire({
            title: 'Department created!',
            type: 'success',
            timer: 1500
          });
          this.router.navigate(['/departments']);
          return new depActions.CreateDepartmentSuccess({
            department: newDepartment
          });
        }),
        catchError(err => {
          Swal.fire({
            title: 'Ooops, something went wrong!',
            type: 'error',
            timer: 1500
          });
          return of(new depActions.CreateDepartmentFail(err));
        })
      )
    )
  );

  @Effect()
  loadDepartment$: Observable<Action> = this.actions$.pipe(
    ofType<depActions.DepartmentRequested>(depActions.DepartmentActionTypes.DEPARTMENT_REQUESTED),
    mergeMap(action => this.departmentService.getOne(action.payload.departmentId)),
    map(department => new depActions.DepartmentLoaded({ department }))
  );

  @Effect()
  loadDepartments$ = this.actions$.pipe(
    ofType<depActions.ListPageRequested>(depActions.DepartmentActionTypes.DEPARTMENT_LIST_PAGE_REQUESTED),
    mergeMap(({ payload }) =>
      this.departmentService
        .getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
        .pipe(
          catchError(err => {
            console.log('error loading a departments page ', err);
            this.store.dispatch(new depActions.ListPageCancelled());
            return of(new DepartmentServerResponse());
          })
        )
    ),
    map((response: DepartmentServerResponse) => new depActions.ListPageLoaded(response))
  );

  @Effect({ dispatch: false })
  deleteDepartment$ = this.actions$.pipe(
    ofType<depActions.DeleteDepartment>(depActions.DepartmentActionTypes.DELETE_DEPARTMENT),
    mergeMap(action => this.departmentService.delete(action.payload.departmentId)),
    map(() => {
      Swal.fire({
        text: `Department deleted`,
        type: 'success',
        timer: 6000,
        toast: true,
        showConfirmButton: false,
        position: 'bottom-end'
      });
    })
  );

  @Effect()
  loadDashboardData$ = this.actions$.pipe(
    ofType<depActions.DepDashboardDataRequested>(depActions.DepartmentActionTypes.DEPARTMENT_DASHBOARD_DATA_REQUESTED),
    withLatestFrom(this.store.pipe(select(selectDashboardDepDataLoaded))),
    filter(([action, selectDashboardDepDataLoaded]) => !selectDashboardDepDataLoaded),
    mergeMap(() => this.departmentService.getDashboardData()),
    map(resp => new depActions.DepDashboardDataLoaded(resp)),
    catchError(err => {
      console.log('error loading dep data for dashboard ', err);
      return throwError(err);
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private departmentService: DepartmentService,
    private router: Router
  ) {}
}
