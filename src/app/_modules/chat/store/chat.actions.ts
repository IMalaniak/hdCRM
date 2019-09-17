import { Action } from '@ngrx/store';
import { Chat } from '../_models';

export enum ChatActionTypes {
  CHAT_LIST_PAGE_REQUESTED = '[Chats List] Chats Page Requested',
  CHAT_LIST_PAGE_LOADED = '[Chats API] Chats Page Loaded',
  CHAT_LIST_PAGE_CANCELLED = '[Chats API] Chats Page Cancelled', 
  SET_CURRENT_CHAT = '[Chats] Set Current Product',
  CLEAR_CURRENT_CHAT = '[Chats] Clear Current Product',
}

export class ListPageRequested implements Action {
  readonly type = ChatActionTypes.CHAT_LIST_PAGE_REQUESTED;
}

export class ListPageLoaded implements Action {
  readonly type = ChatActionTypes.CHAT_LIST_PAGE_LOADED;
  constructor(public payload: Chat[]) {}
}

export class ListPageCancelled implements Action {
  readonly type = ChatActionTypes.CHAT_LIST_PAGE_CANCELLED;
}

export class SetCurrentChat implements Action {
  readonly type = ChatActionTypes.SET_CURRENT_CHAT;
  constructor(public payload: Chat) {}
}

export class ClearCurrentChat implements Action {
  readonly type = ChatActionTypes.CLEAR_CURRENT_CHAT;
}

export type ChatActions = ListPageRequested
  | ListPageLoaded
  | ListPageCancelled
  | SetCurrentChat
  | ClearCurrentChat;