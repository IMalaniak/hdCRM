import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as depActions from './department.actions';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { DepartmentService } from '../services';
import { AppState } from '@/core/reducers';
import { DepartmentServerResponse, Department } from '../models';
import { selectDashboardDepDataLoaded } from './department.selectors';
import { Router } from '@angular/router';
import { ToastMessageService } from '@/shared';

@Injectable()
export class DepartmentEffects {
  createDepartment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(depActions.createDepartment),
      map(payload => payload.department),
      mergeMap((department: Department) =>
        this.departmentService.create(department).pipe(
          map(newDepartment => {
            this.toastMessageService.popup('Department created!', 'success');
            this.router.navigate(['/departments']);
            return depActions.createDepartmentSuccess({
              department: newDepartment
            });
          }),
          catchError(error => {
            this.toastMessageService.popup('Ooops, something went wrong!', 'error');
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
          map((response: DepartmentServerResponse) => depActions.listPageLoaded({ response })),
          catchError(err => of(depActions.listPageCancelled()))
        )
      )
    )
  );

  deleteDepartment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(depActions.deleteDepartment),
        map(payload => payload.id),
        mergeMap(id => this.departmentService.delete(id)),
        map(() => of(this.toastMessageService.toast('Department deleted!')))
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
    private router: Router,
    private toastMessageService: ToastMessageService
  ) {}
}
