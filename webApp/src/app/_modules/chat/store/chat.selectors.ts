import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatsState } from './chat.reducer';

import * as fromChat from './chat.reducer';
// import { Chat } from '../_models';
// import { PageQuery } from '@/core/_models';

export const selectChatsState = createFeatureSelector<ChatsState>('chats');

export const selectAllChats = createSelector(selectChatsState, fromChat.selectAll);

export const selectChatsLoading = createSelector(selectChatsState, chatsState => chatsState.loading);

export const getCurrentChatId = createSelector(selectChatsState, chatsState => chatsState.currentChatId);

// export const getCurrentChat = createSelector(selectChatsState, getCurrentChatId, (chatsState, currentChatId) => {
//   if (currentChatId === 0) {
//     return {
//       id: 0,
//       messages: []
//     };
//   } else {
//     return currentChatId ? chatsState.chats.find(chat => chat.id === currentChatId) : null;
//   }
// });

export const getGroupChatSocketInited = createSelector(selectChatsState, chatsState => chatsState.groupChatSocketInited);

export const getPrivateChatSocketInited = createSelector(selectChatsState, chatsState => chatsState.privateChatSocketInited);
