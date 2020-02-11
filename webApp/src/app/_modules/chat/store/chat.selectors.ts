import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromChat from './chat.reducer';

export const selectChatsState = createFeatureSelector<fromChat.ChatsState>(fromChat.chatsFeatureKey);
export const selectGChatsState = createSelector(selectChatsState, chatsState => chatsState.groupChats);
export const selectPChatsState = createSelector(selectChatsState, chatsState => chatsState.privateChats);

export const selectAllGChatsLoaded = createSelector(selectGChatsState, gState => gState.allChatsLoaded);
export const selectAllPChatsLoaded = createSelector(selectPChatsState, pState => pState.allChatsLoaded);

export const selectAllGChats = createSelector(selectGChatsState, fromChat.selectAllGChats);
export const selectAllPChats = createSelector(selectPChatsState, fromChat.selectAllPChats);

export const selectChatsLoading = createSelector(selectChatsState, chatsState => chatsState.loading);

export const getCurrentGChatId = createSelector(selectGChatsState, chatsState => chatsState.currentChatId);
export const getCurrentPChatId = createSelector(selectPChatsState, chatsState => chatsState.currentChatId);

export const getCurrentGChat = createSelector(
  selectGChatsState,
  getCurrentGChatId,
  (chatsState, currentChatId) => chatsState.entities[currentChatId]
);

export const getGroupChatSocketInited = createSelector(
  selectChatsState,
  chatsState => chatsState.groupChats.groupChatSocketInited
);

export const getPrivateChatSocketInited = createSelector(
  selectChatsState,
  chatsState => chatsState.privateChats.privateChatSocketInited
);
