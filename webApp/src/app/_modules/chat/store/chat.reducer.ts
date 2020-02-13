import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Chat } from '../_models';
import { ChatActions, ChatActionTypes } from './chat.actions';

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
  error: string;
  groupChats: GroupChatsState;
  privateChats: PrivateChatsState;
}

export const groupChatAdapter: EntityAdapter<Chat> = createEntityAdapter<Chat>();
export const privateChatAdapter: EntityAdapter<Chat> = createEntityAdapter<Chat>();

export const groupChatInitialState: GroupChatsState = groupChatAdapter.getInitialState({
  allChatsLoaded: false,
  currentChatId: null,
  groupChatSocketInited: false
});

export const privateChatInitialState: PrivateChatsState = privateChatAdapter.getInitialState({
  allChatsLoaded: false,
  currentChatId: null,
  privateChatSocketInited: false
});

export const initialChatsState: ChatsState = {
  loading: false,
  error: null,
  groupChats: groupChatInitialState,
  privateChats: privateChatInitialState,
};

export function chatsReducer(state = initialChatsState, action: ChatActions): ChatsState {
  switch (action.type) {
    case ChatActionTypes.GROUP_CHAT_LIST_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case ChatActionTypes.GROUP_CHAT_LIST_LOADED:
      return {
        ...state,
        loading: false,
        groupChats: groupChatAdapter.upsertMany(action.payload, {
          ...state.groupChats,
          allChatsLoaded: true
        })
      };

    case ChatActionTypes.NEW_GROUP_CHAT_ADDED:
      return {
        ...state,
        groupChats: groupChatAdapter.addOne(action.payload.chat, {
          ...state.groupChats
        })
      };

    case ChatActionTypes.SET_CURRENT_GROUP_CHAT:
      return {
        ...state,
        groupChats: {...state.groupChats, currentChatId: action.payload.id}
      };

    case ChatActionTypes.SET_CURRENT_PRIVATE_CHAT:
      return {
        ...state,
        privateChats: {...state.privateChats, currentChatId: action.payload.id}
      };

    // case ChatActionTypes.CLEAR_CURRENT_CHAT:
    //   return {
    //     ...state,
    //     currentChatId: null
    //   };

    case ChatActionTypes.INIT_GROUP_CHAT_SOCKET:
      return {
        ...state,
        groupChats: {...state.groupChats, groupChatSocketInited: true}
      };

    case ChatActionTypes.INIT_PRIVATE_CHAT_SOCKET:
      return {
        ...state,
        privateChats: {...state.privateChats, privateChatSocketInited: true}
      };

    default: {
      return state;
    }
  }
}

export const { selectAll: selectAllGChats, selectEntities: selectEntitiesGChats, selectIds: selectIdsGChats, selectTotal: selectTotalGChats } = groupChatAdapter.getSelectors();
export const { selectAll: selectAllPChats, selectEntities: selectEntitiesPChats, selectIds: selectIdsPChats, selectTotal: selectTotalPChats } = privateChatAdapter.getSelectors();
