import { createAction, props } from '@ngrx/store';
import { Chat } from '../models';

export const initPrivateChatSocket = createAction(
  '[Private Chat] Init Private Chat Socket'
);

export const privateChatListRequested = createAction(
  '[Private Chat List] Private Chat List Requested'
);

export const privateChatListLoaded = createAction(
  '[Private Chat API] Private Chat List Loaded',
  props<{ chatList: Chat[] }>()
);

export const privateChatListCancelled = createAction(
  '[Private Chats API] Private Chat List Cancelled'
);

export const newPrivateChatAdded = createAction(
  '[Private Chats API] New Private Chat Added',
  props<{ chat: Chat }>()
);

export const setCurrentPrivateChat = createAction(
  '[Private Chats List] Set Current Private Chat',
  props<{ chat: Chat }>()
);

export const clearCurrentPrivateChat = createAction(
  '[Private Chat List] Clear Current Private Chat',
);

