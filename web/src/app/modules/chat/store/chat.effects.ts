import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as groupChatActions from './group-chat.actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap } from 'rxjs/operators';
import { ChatService } from '../services';
import { AppState } from '@/core/reducers';
import { Chat } from '../models';
import { SocketService, SocketEvent } from '@/shared';
import { selectAllGChatsLoaded } from './chat.selectors';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ChatEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private chatService: ChatService,
    private scktService: SocketService
  ) {}

  toggleRightSidebar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(groupChatActions.groupChatListRequested),
      withLatestFrom(this.store.pipe(select(selectAllGChatsLoaded))),
      filter(([_, allGChatsLoaded]) => !allGChatsLoaded),
      tap(() => {
        this.chatService.getGroupChatList();
      }),
      mergeMap(() => {
        return this.chatService.groupChatListed$.pipe(
          map((chatList: Chat[]) => groupChatActions.groupChatListLoaded({ chatList }))
        );
      }),
      catchError((errorResponse: HttpErrorResponse) =>
        of(groupChatActions.groupChatListCancelled({ apiResp: errorResponse.error }))
      )
    )
  );

  initGroupChatSocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(groupChatActions.initGroupChatSocket),
        mergeMap(() => of(this.scktService.emit(SocketEvent.INITMODULE, { moduleName: 'group-chat' }))),
        catchError((err) => throwError(err))
      ),
    {
      dispatch: false
    }
  );
}
