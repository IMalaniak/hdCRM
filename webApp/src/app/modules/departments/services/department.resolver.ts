import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Department } from '../models';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { selectDepartmentById } from '../store/department.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { departmentRequested } from '../store/department.actions';

@Injectable()
export class DepartmentResolver implements Resolve<Department> {
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Department> {
    const id = route.params['id'];

    return this.store.pipe(
      select(selectDepartmentById(id)),
      tap(department => {
        if (!department) {
          this.store.dispatch(departmentRequested({ id }));
        }
      }),
      filter(department => !!department),
      first()
    );
  }
}
