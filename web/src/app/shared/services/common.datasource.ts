import { DataSource } from '@angular/cdk/collections';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export class CommonDataSource<T> implements DataSource<T> {
  protected listSubject = new BehaviorSubject<T[]>([]);

  connect(): Observable<T[]> {
    return this.listSubject.asObservable();
  }

  disconnect(): void {
    this.listSubject.complete();
  }

  isEmpty(): Observable<boolean> {
    return this.connect().pipe(map((data) => data.length === 0));
  }
}
