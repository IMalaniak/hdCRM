import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DepartmentRequested, DepartmentActionTypes, DepartmentLoaded, ListPageRequested, ListPageLoaded, ListPageCancelled, DepDashboardDataRequested, DepDashboardDataLoaded, CreateDepartment, CreateDepartmentSuccess, CreateDepartmentFail } from './department.actions';
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
      ofType<CreateDepartment>(DepartmentActionTypes.CreateDepartment),
      map((action: CreateDepartment) => action.payload.department),
      mergeMap((department: Department) =>
        this.departmentService.create({...department}).pipe(
          map(newDepartment => {
            Swal.fire({
              title: 'Department created!',
              type: 'success',
              timer: 1500
            });
            this.router.navigate(['/departments']);
            return new CreateDepartmentSuccess({department: newDepartment});
          }),
          catchError(err => {
            Swal.fire({
              title: 'Ooops, something went wrong!',
              type: 'error',
              timer: 1500
            });
            return of(new CreateDepartmentFail(err));
          })
        )
      )
    );

    @Effect()
    loadDepartment$: Observable<Action> = this.actions$.pipe(
        ofType<DepartmentRequested>(DepartmentActionTypes.DepartmentRequested),
        mergeMap(action => this.departmentService.getOne(action.payload.departmentId)),
        map(department => new DepartmentLoaded({department}))
    );

    @Effect()
    loadDepartments$ = this.actions$.pipe(
        ofType<ListPageRequested>(DepartmentActionTypes.ListPageRequested),
        mergeMap(({payload}) =>
                this.departmentService.getList(payload.page.pageIndex, payload.page.pageSize, payload.page.sortIndex, payload.page.sortDirection)
                  .pipe(
                    catchError(err => {
                      console.log('error loading a departments page ', err);
                      this.store.dispatch(new ListPageCancelled());
                      return of(new DepartmentServerResponse());
                    })
                  )
        ),
        map((response: DepartmentServerResponse) => new ListPageLoaded(response)),
    );

    @Effect()
    loadDashboardData$ = this.actions$.pipe(
        ofType<DepDashboardDataRequested>(DepartmentActionTypes.DepDashboardDataRequested),
        withLatestFrom(this.store.pipe(select(selectDashboardDepDataLoaded))),
        filter(([action, selectDashboardDepDataLoaded]) => !selectDashboardDepDataLoaded),
        mergeMap(() => this.departmentService.getDashboardData()),
        map(resp => new DepDashboardDataLoaded(resp)),
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
