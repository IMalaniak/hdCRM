import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Department } from '../models/';
import { catchError, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { listPageRequested } from '../store/department.actions';
import { selectDepartmentsPage } from '../store/department.selectors';
import { AppState } from '@/core/reducers';
import { PageQuery } from '@/shared';

export class DepartmentsDataSource implements DataSource<Department> {
  private departmentsSubject = new BehaviorSubject<Department[]>([]);

  constructor(private store: Store<AppState>) {}

  loadDepartments(page: PageQuery) {
    this.store
      .pipe(
        select(selectDepartmentsPage(page)),
        tap(departments => {
          if (departments.length > 0) {
            this.departmentsSubject.next(departments);
          } else {
            this.store.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  connect(collectionViewer: CollectionViewer): Observable<Department[]> {
    return this.departmentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.departmentsSubject.complete();
  }
}

// TODO check for better solution
function sortData(data, page: PageQuery) {
  if (!page.sortIndex || page.sortDirection === '') {
    return data;
  }

  return data.sort((a: Department, b: Department) => {
    const isAsc = page.sortDirection === 'asc';
    switch (page.sortIndex) {
      case 'id':
        return compare(a.id, b.id, isAsc);
      case 'title':
        return compare(a.title, b.title, isAsc);
      case 'createdAt':
        return compare(a.createdAt, b.createdAt, isAsc);
      case 'updatedAt':
        return compare(a.updatedAt, b.updatedAt, isAsc);
      default:
        return 0;
    }
  });
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
