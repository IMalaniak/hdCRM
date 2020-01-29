import { Action } from '@ngrx/store';
import { Chat } from '../_models';

export enum ChatActionTypes {
  INIT_GROUP_CHAT_SOCKET = '[Group Chat List] Init Group Chat Socket',
  GROUP_CHAT_LIST_REQUESTED = '[Group Chat List] Group Chat List Requested',
  GROUP_CHAT_LIST_LOADED = '[Group Chat API] Group Chat List Loaded',
  GROUP_CHAT_LIST_CANCELLED = '[Group Chats API] Group Chat List Cancelled',
  NEW_GROUP_CHAT_ADDED = '[Group Chats API] New Group Chat Added',
  SET_CURRENT_GROUP_CHAT = '[Group Chats List] Set Current Group Chat',
  CLEAR_CURRENT_GROUP_CHAT = '[Group Chat List] Clear Current Group Chat',

  INIT_PRIVATE_CHAT_SOCKET = '[Private Chat List] Init Private Chat Socket',
  PRIVATE_CHAT_LIST_REQUESTED = '[Private Chat List] Private Chat List Requested',
  PRIVATE_CHAT_LIST_LOADED = '[Private Chat API] Private Chat List Loaded',
  PRIVATE_CHAT_LIST_CANCELLED = '[Private Chats API] Private Chat List Cancelled',
  SET_CURRENT_PRIVATE_CHAT = '[Private Chat List] Set Current Private Chat',
  CLEAR_CURRENT_PRIVATE_CHAT = '[Private Chat List] Clear Current Private Chat'
}


export class InitGroupChatSocket implements Action {
  readonly type = ChatActionTypes.INIT_GROUP_CHAT_SOCKET;
}

export class GroupChatListRequested implements Action {
  readonly type = ChatActionTypes.GROUP_CHAT_LIST_REQUESTED;
}

export class GroupChatListLoaded implements Action {
  readonly type = ChatActionTypes.GROUP_CHAT_LIST_LOADED;
  constructor(public payload: Chat[]) {}
}

export class GroupChatListCancelled implements Action {
  readonly type = ChatActionTypes.GROUP_CHAT_LIST_CANCELLED;
}

export class NewGroupChatAdded implements Action {
  readonly type = ChatActionTypes.NEW_GROUP_CHAT_ADDED;
  constructor(public payload: {chat: Chat}) {}
}

export class SetCurrentGroupChat implements Action {
  readonly type = ChatActionTypes.SET_CURRENT_GROUP_CHAT;
  constructor(public payload: Chat) {}
}

export class ClearCurrentGroupChat implements Action {
  readonly type = ChatActionTypes.CLEAR_CURRENT_GROUP_CHAT;
}

export class InitPrivateChatSocket implements Action {
  readonly type = ChatActionTypes.INIT_PRIVATE_CHAT_SOCKET;
}

export class PrivateChatListRequested implements Action {
  readonly type = ChatActionTypes.PRIVATE_CHAT_LIST_REQUESTED;
}

export class PrivateChatListLoaded implements Action {
  readonly type = ChatActionTypes.PRIVATE_CHAT_LIST_LOADED;
  constructor(public payload: Chat[]) {}
}

export class PrivateChatListCancelled implements Action {
  readonly type = ChatActionTypes.PRIVATE_CHAT_LIST_CANCELLED;
}

export class SetCurrentPrivateChat implements Action {
  readonly type = ChatActionTypes.SET_CURRENT_PRIVATE_CHAT;
  constructor(public payload: Chat) {}
}

export class ClearCurrentPrivateChat implements Action {
  readonly type = ChatActionTypes.CLEAR_CURRENT_PRIVATE_CHAT;
}


export type ChatActions =
  | InitGroupChatSocket
  | GroupChatListRequested
  | GroupChatListLoaded
  | GroupChatListCancelled
  | NewGroupChatAdded
  | SetCurrentGroupChat
  | ClearCurrentGroupChat
  | InitPrivateChatSocket
  | PrivateChatListRequested
  | PrivateChatListLoaded
  | PrivateChatListCancelled
  | SetCurrentPrivateChat
  | ClearCurrentPrivateChat;
