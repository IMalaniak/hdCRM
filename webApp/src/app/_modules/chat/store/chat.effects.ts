import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as chatActions from './chat.actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap, take } from 'rxjs/operators';
import { ChatService } from '../_services';
import { AppState } from '@/core/reducers';
// import { DepartmentServerResponse, Chat } from '../_models';
import { Chat } from '../_models';
// import { selectDashboardDepDataLoaded } from './department.selectors';
import { Router } from '@angular/router';
import { SocketEvent } from '@/_shared/models/socketEvent';
import { SocketService } from '@/_shared/services/socket.service';
import { selectAllGChats, selectAllGChatsLoaded } from './chat.selectors';

@Injectable()
export class ChatEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private chatService: ChatService,
    private scktService: SocketService,
    private router: Router
  ) {}

  @Effect()
  loadGroupChats$ = this.actions$.pipe(
    ofType<chatActions.GroupChatListRequested>(chatActions.ChatActionTypes.GROUP_CHAT_LIST_REQUESTED),
    withLatestFrom(this.store.pipe(select(selectAllGChatsLoaded))),
    filter(([action, allGChatsLoaded]) => !allGChatsLoaded),
    tap(() => {
      this.chatService.getGroupChatList();
    }),
    mergeMap(() => {
      return this.chatService.groupChatListed$.pipe(
        map((response: Chat[]) => new chatActions.GroupChatListLoaded(response))
      );
    }),
    catchError(err => throwError(err)),
  );


  @Effect({ dispatch: false })
  initGroupChatSocket$ = this.actions$.pipe(
    ofType<chatActions.InitGroupChatSocket>(chatActions.ChatActionTypes.INIT_GROUP_CHAT_SOCKET),
    mergeMap(() =>
      of(this.scktService.emit(SocketEvent.INITMODULE, {moduleName: 'group-chat'}))
    ),
    catchError(err => throwError(err))
  );


}
