import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/reducers';
import { PageQuery } from '../models';

export abstract class CommonDataSource<T> implements DataSource<T> {
  protected listSubject = new BehaviorSubject<T[]>([]);

  constructor(protected store$: Store<AppState>) {}

  /**
   * Provides logic to retrieve data from Store
   * @param page is query params with page data
   */
  abstract loadData(page: PageQuery): void;

  connect(): Observable<T[]> {
    return this.listSubject.asObservable();
  }

  disconnect(): void {
    this.listSubject.complete();
  }
}
