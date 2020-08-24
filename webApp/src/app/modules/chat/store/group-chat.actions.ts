import { createAction, props } from '@ngrx/store';
import { Chat } from '../models';
import { ApiResponse } from '@/shared';

export const initGroupChatSocket = createAction('[Group Chat] Init Group Chat Socket');

export const groupChatListRequested = createAction('[Group Chat List] Group Chat List Requested');

export const groupChatListLoaded = createAction(
  '[Group Chat API] Group Chat List Loaded',
  props<{ chatList: Chat[] }>()
);

export const groupChatListCancelled = createAction(
  '[Group Chats API] Group Chat List Cancelled',
  props<{ apiResp: ApiResponse }>()
);

export const newGroupChatAdded = createAction('[Group Chats API] New Group Chat Added', props<{ chat: Chat }>());

export const setCurrentGroupChat = createAction('[Group Chats List] Set Current Group Chat', props<{ chat: Chat }>());

export const clearCurrentGroupChat = createAction('[Group Chat List] Clear Current Group Chat');
