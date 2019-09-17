import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as chatActions from './chat.actions';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { ChatService } from '../_services';
import { AppState } from '@/core/reducers';
// import { DepartmentServerResponse, Chat } from '../_models';
import { Chat } from '../_models';
// import { selectDashboardDepDataLoaded } from './department.selectors';
import { Router } from '@angular/router';

@Injectable()
export class ChatEffects {

    @Effect()
    loadChats$ = this.actions$.pipe(
        ofType<chatActions.ListPageRequested>(chatActions.ChatActionTypes.CHAT_LIST_PAGE_REQUESTED),
        mergeMap(() => this.chatService.getList()
            .pipe(
                catchError(err => {
                this.store.dispatch(new chatActions.ListPageCancelled());
                return of([]);
                })
            )),
        catchError(err => throwError(err)),
        map((response: Chat[]) => new chatActions.ListPageLoaded(response)),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private chatService: ChatService,
        private router: Router
    ) {}
}
