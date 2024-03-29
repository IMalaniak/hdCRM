import { DataSource } from '@angular/cdk/collections';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';

import { AppState } from '@core/store';

import { PageQuery } from '../models';
import { DataRow } from '../models/table';

export abstract class CommonDataSource<T> implements DataSource<DataRow> {
  protected listSubject = new BehaviorSubject<DataRow[]>([]);

  constructor(protected readonly store$: Store<AppState>) {}

  connect(): Observable<DataRow[]> {
    return this.listSubject.asObservable();
  }

  disconnect(): void {
    this.listSubject.complete();
  }

  /**
   * Provides logic to retrieve data from Store
   *
   * @param page is query params with page data
   */
  abstract loadData(page: PageQuery): void;

  /**
   * Provides logic to map retrieved data from Store to DataRow
   *
   * @param data array of objects retrieved from Store
   */
  protected abstract mapToDataRows(data: T[]): DataRow[];
}
