import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Department } from '../_models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectDepartmentById } from '../store/department.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { DepartmentRequested } from '../store/department.actions';

@Injectable()
export class DepartmentResolver implements Resolve<Department> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Department> {
    const departmentId = route.params['id'];

    return this.store.pipe(
      select(selectDepartmentById(departmentId)),
      tap(department => {
        if (!department) {
          this.store.dispatch(new DepartmentRequested({ departmentId }));
        }
      }),
      filter(department => !!department),
      first()
    );
  }
}
