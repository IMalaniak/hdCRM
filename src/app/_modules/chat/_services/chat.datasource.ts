import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject, of} from 'rxjs';
import {Chat} from '../_models';
import {catchError, tap} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {ListPageRequested} from '../store/chat.actions';
// import {selectChatsPage} from '../store/chat.selectors';
import { AppState } from '@/core/reducers';
import { PageQuery } from '@/core/_models';
import { selectAllChats } from '../store/chat.selectors';

export class ChatsDataSource implements DataSource<Chat> {

    private chatsSubject = new BehaviorSubject<Chat[]>([]);

    constructor(private store: Store<AppState>) {

    }

    loadChats() {
        this.store.pipe(
            select(selectAllChats),
            tap(chats => {
              if (chats.length > 0) {
                this.chatsSubject.next(chats);
              } else {
                this.store.dispatch(new ListPageRequested());
              }
            }),
            catchError(() => of([]))
          )
          .subscribe();
    }

    connect(collectionViewer: CollectionViewer): Observable<Chat[]> {
        return this.chatsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.chatsSubject.complete();
    }

}

// TODO check for better solution
// function sortData(data, page: PageQuery) {
//   if (!page.sortIndex || page.sortDirection === '') {
//     return data;
//   }

//   return data.sort((a: Department, b: Department) => {
//     const isAsc = page.sortDirection === 'asc';
//     switch (page.sortIndex) {
//       case 'id': return compare(a.id, b.id, isAsc);
//       case 'title': return compare(a.title, b.title, isAsc);
//       case 'createdAt': return compare(a.createdAt, b.createdAt, isAsc);
//       case 'updatedAt': return compare(a.updatedAt, b.updatedAt, isAsc);
//       default: return 0;
//     }
//   });
// }

// function compare(a, b, isAsc) {
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }
