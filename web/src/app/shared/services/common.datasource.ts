import { DataSource } from '@angular/cdk/collections';

import { Observable, BehaviorSubject } from 'rxjs';

export class CommonDataSource<T> implements DataSource<T> {
  protected listSubject = new BehaviorSubject<T[]>([]);

  connect(): Observable<T[]> {
    return this.listSubject.asObservable();
  }

  disconnect(): void {
    this.listSubject.complete();
  }
}
