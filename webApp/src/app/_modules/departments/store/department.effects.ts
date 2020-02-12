import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
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
  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.createDepartment),
      map(payload => payload.department),
      mergeMap((department: Department) =>
        this.departmentService.create(department).pipe(
          map(newDepartment => {
            Swal.fire({
              title: 'Department created!',
              type: 'success',
              timer: 1500
            });
            this.router.navigate(['/departments']);
            return depActions.createDepartmentSuccess({
              department: newDepartment
            });
          }),
          catchError(error => {
            Swal.fire({
              title: 'Ooops, something went wrong!',
              type: 'error',
              timer: 1500
            });
            return of(depActions.createDepartmentFail(error));
          })
        )
      )
    )
  );

  loadDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.departmentRequested),
      map(payload => payload.id),
      mergeMap(id => this.departmentService.getOne(id)),
      map(department => depActions.departmentLoaded({ department }))
    )
  );

  loadDepartments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.listPageRequested),
      map(payload => payload.page),
      mergeMap(page =>
        this.departmentService.getList(page.pageIndex, page.pageSize, page.sortIndex, page.sortDirection).pipe(
          catchError(err => {
            this.store.dispatch(depActions.listPageCancelled());
            return of(new DepartmentServerResponse());
          })
        )
      ),
      map((response: DepartmentServerResponse) => depActions.listPageLoaded({ response }))
    )
  );

  deleteDepartment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(depActions.deleteDepartment),
        map(payload => payload.id),
        mergeMap(id => this.departmentService.delete(id)),
        map(() =>
          of(
            Swal.fire({
              text: `Department deleted`,
              type: 'success',
              timer: 6000,
              toast: true,
              showConfirmButton: false,
              position: 'bottom-end'
            })
          )
        )
      ),
    {
      dispatch: false
    }
  );

  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.depDashboardDataRequested),
      withLatestFrom(this.store.pipe(select(selectDashboardDepDataLoaded))),
      filter(([action, selectDashboardDepDataLoaded]) => !selectDashboardDepDataLoaded),
      mergeMap(() => this.departmentService.getDashboardData()),
      map(response => depActions.depDashboardDataLoaded({ response })),
      catchError(err => {
        return throwError(err);
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private departmentService: DepartmentService,
    private router: Router
  ) {}
}
