import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Plan } from '../_models/';
import { catchError, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { listPageRequested } from '../store/plan.actions';
import { selectPlansPage } from '../store/plan.selectors';
import { AppState } from '@/core/reducers';
import { PageQuery } from '@/core/_models';

export class PlansDataSource implements DataSource<Plan> {
  private plansSubject = new BehaviorSubject<Plan[]>([]);

  constructor(private store: Store<AppState>) {}

  loadPlans(page: PageQuery) {
    this.store
      .pipe(
        select(selectPlansPage(page)),
        tap(plans => {
          if (plans.length > 0) {
            this.plansSubject.next(plans);
          } else {
            this.store.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  connect(collectionViewer: CollectionViewer): Observable<Plan[]> {
    return this.plansSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.plansSubject.complete();
  }
}

// TODO check for better solution
function sortData(data, page: PageQuery) {
  if (!page.sortIndex || page.sortDirection === '') {
    return data;
  }

  return data.sort((a: Plan, b: Plan) => {
    const isAsc = page.sortDirection === 'asc';
    switch (page.sortIndex) {
      case 'id':
        return compare(a.id, b.id, isAsc);
      case 'title':
        return compare(a.title, b.title, isAsc);
      case 'deadline':
        return compare(a.deadline, b.deadline, isAsc);
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
