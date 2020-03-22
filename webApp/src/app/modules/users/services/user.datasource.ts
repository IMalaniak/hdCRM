import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from '../models/';
import { catchError, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { listPageRequested } from '../store/user.actions';
import { selectUsersPage } from '../store/user.selectors';
import { AppState } from '@/core/reducers';
import { PageQuery } from '@/shared';

export class UsersDataSource implements DataSource<User> {
  private usersSubject = new BehaviorSubject<User[]>([]);

  constructor(private store: Store<AppState>) {}

  loadUsers(page: PageQuery) {
    this.store
      .pipe(
        select(selectUsersPage(page)),
        tap(users => {
          if (users.length > 0) {
            this.usersSubject.next(users);
          } else {
            this.store.dispatch(listPageRequested({ page }));
          }
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
  }
}
