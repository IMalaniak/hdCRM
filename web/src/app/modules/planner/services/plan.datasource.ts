import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Plan } from '../models/';
import { catchError, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { listPageRequested } from '../store/plan.actions';
import { selectPlansOfPage } from '../store/plan.selectors';
import { AppState } from '@/core/reducers';
import { PageQuery } from '@/shared/models';

export class PlansDataSource implements DataSource<Plan> {
  private plansSubject = new BehaviorSubject<Plan[]>([]);

  constructor(private store: Store<AppState>) {}

  loadPlans(page: PageQuery) {
    this.store
      .pipe(
        select(selectPlansOfPage(page)),
        tap((plans) => {
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

  connect(): Observable<Plan[]> {
    return this.plansSubject.asObservable();
  }

  disconnect(): void {
    this.plansSubject.complete();
  }
}
