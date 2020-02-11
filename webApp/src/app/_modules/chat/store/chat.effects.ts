import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as groupChatActions from './group-chat.actions';
import * as privateChatActions from './private-chat.actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap, take } from 'rxjs/operators';
import { ChatService } from '../_services';
import { AppState } from '@/core/reducers';
import { Chat } from '../_models';
import { SocketEvent } from '@/_shared/models/socketEvent';
import { SocketService } from '@/_shared/services/socket.service';
import { selectAllGChatsLoaded } from './chat.selectors';

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
      filter(([action, allGChatsLoaded]) => !allGChatsLoaded),
      tap(() => {
        this.chatService.getGroupChatList();
      }),
      mergeMap(() => {
        return this.chatService.groupChatListed$.pipe(
          map((chatList: Chat[]) => groupChatActions.groupChatListLoaded({ chatList }))
        );
      }),
      catchError(err => throwError(err))
    )
  );

  initGroupChatSocket$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(groupChatActions.initGroupChatSocket),
        mergeMap(() => of(this.scktService.emit(SocketEvent.INITMODULE, { moduleName: 'group-chat' }))),
        catchError(err => throwError(err))
      ),
    {
      dispatch: false
    }
  );
}
