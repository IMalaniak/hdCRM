import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Role } from '../models/';
import { catchError, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { listPageRequested } from '../store/role.actions';
import { selectRolesPage } from '../store/role.selectors';
import { AppState } from '@/core/reducers';
import { PageQuery } from '@/shared';

export class RolesDataSource implements DataSource<Role> {
  private rolesSubject = new BehaviorSubject<Role[]>([]);

  constructor(private store: Store<AppState>) {}

  loadRoles(page: PageQuery) {
    this.store
      .pipe(
        select(selectRolesPage(page)),
        tap((roles) => {
          if (roles.length > 0) {
            this.rolesSubject.next(roles);
          } else {
            this.store.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  connect(): Observable<Role[]> {
    return this.rolesSubject.asObservable();
  }

  disconnect(): void {
    this.rolesSubject.complete();
  }
}
