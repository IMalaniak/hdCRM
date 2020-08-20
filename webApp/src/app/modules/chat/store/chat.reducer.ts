import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Chat } from '../models';
import * as groupChatActionTypes from './group-chat.actions';
import * as privateChatActionTypes from './private-chat.actions';
import { createReducer, Action, on } from '@ngrx/store';
import { ApiResponse } from '@/shared';

export interface GroupChatsState extends EntityState<Chat> {
  allChatsLoaded: boolean;
  currentChatId: number | null;
  groupChatSocketInited: boolean;
}

export interface PrivateChatsState extends EntityState<Chat> {
  allChatsLoaded: boolean;
  currentChatId: number | null;
  privateChatSocketInited: boolean;
}

export interface ChatsState {
  loading: boolean;
  apiResp: ApiResponse;
  groupChats: GroupChatsState;
  privateChats: PrivateChatsState;
}

const groupChatAdapter: EntityAdapter<Chat> = createEntityAdapter<Chat>();
const privateChatAdapter: EntityAdapter<Chat> = createEntityAdapter<Chat>();

const groupChatInitialState: GroupChatsState = groupChatAdapter.getInitialState({
  allChatsLoaded: false,
  currentChatId: null,
  groupChatSocketInited: false
});

const privateChatInitialState: PrivateChatsState = privateChatAdapter.getInitialState({
  allChatsLoaded: false,
  currentChatId: null,
  privateChatSocketInited: false
});

const initialChatsState: ChatsState = {
  loading: false,
  apiResp: null,
  groupChats: groupChatInitialState,
  privateChats: privateChatInitialState
};

const chatsReducer = createReducer(
  initialChatsState,
  on(groupChatActionTypes.groupChatListRequested, state => ({ ...state, loading: true })),
  on(groupChatActionTypes.groupChatListLoaded, (state, { chatList }) => ({
    ...state,
    loading: false,
    groupChats: groupChatAdapter.upsertMany(chatList, {
      ...state.groupChats,
      allChatsLoaded: true
    })
  })),
  on(groupChatActionTypes.groupChatListCancelled, (state, { apiResp }) => ({
    ...state,
    loading: false,
    apiResp
  })),
  on(groupChatActionTypes.newGroupChatAdded, (state, { chat }) => ({
    ...state,
    groupChats: groupChatAdapter.addOne(chat, {
      ...state.groupChats
    })
  })),
  on(groupChatActionTypes.setCurrentGroupChat, (state, { chat }) => ({
    ...state,
    groupChats: { ...state.groupChats, currentChatId: chat.id }
  })),
  on(groupChatActionTypes.clearCurrentGroupChat, state => ({
    ...state,
    groupChats: { ...state.groupChats, currentChatId: null }
  })),
  on(groupChatActionTypes.initGroupChatSocket, state => ({
    ...state,
    groupChats: { ...state.groupChats, groupChatSocketInited: true }
  })),

  on(privateChatActionTypes.privateChatListRequested, state => ({ ...state, loading: true })),
  on(privateChatActionTypes.privateChatListLoaded, (state, { chatList }) => ({
    ...state,
    loading: false,
    privateChats: privateChatAdapter.upsertMany(chatList, {
      ...state.privateChats,
      allChatsLoaded: true
    })
  })),
  on(privateChatActionTypes.newPrivateChatAdded, (state, { chat }) => ({
    ...state,
    privateChats: privateChatAdapter.addOne(chat, {
      ...state.privateChats
    })
  })),
  on(privateChatActionTypes.setCurrentPrivateChat, (state, { chat }) => ({
    ...state,
    privateChats: { ...state.privateChats, currentChatId: chat.id }
  })),
  on(privateChatActionTypes.clearCurrentPrivateChat, state => ({
    ...state,
    privateChats: { ...state.privateChats, currentChatId: null }
  })),
  on(privateChatActionTypes.initPrivateChatSocket, state => ({
    ...state,
    privateChats: { ...state.privateChats, privateChatSocketInited: true }
  }))
);

export function reducer(state: ChatsState | undefined, action: Action) {
  return chatsReducer(state, action);
}

export const chatsFeatureKey = 'chats';

export const {
  selectAll: selectAllGChats,
  selectEntities: selectEntitiesGChats,
  selectIds: selectIdsGChats,
  selectTotal: selectTotalGChats
} = groupChatAdapter.getSelectors();
export const {
  selectAll: selectAllPChats,
  selectEntities: selectEntitiesPChats,
  selectIds: selectIdsPChats,
  selectTotal: selectTotalPChats
} = privateChatAdapter.getSelectors();
