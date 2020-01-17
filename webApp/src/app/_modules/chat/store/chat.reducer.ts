import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Chat } from '../_models';
import { ChatActions, ChatActionTypes } from './chat.actions';

export interface ChatsState extends EntityState<Chat> {
  loading: boolean;
  error: string;
  currentChatId: number | null;
  groupChats: Chat[];
  privateChats: Chat[];
  groupChatSocketInited: boolean;
  privateChatSocketInited: boolean;
}

export const adapter: EntityAdapter<Chat> = createEntityAdapter<Chat>({});

export const initialChatsState: ChatsState = adapter.getInitialState({
  loading: false,
  error: null,
  currentChatId: null,
  groupChats: [],
  privateChats: [],
  groupChatSocketInited: false,
  privateChatSocketInited: false
});

export function chatsReducer(state = initialChatsState, action: ChatActions): ChatsState {
  switch (action.type) {
    case ChatActionTypes.CHAT_LIST_PAGE_REQUESTED:
      return {
        ...state,
        loading: true
      };

    case ChatActionTypes.CHAT_LIST_PAGE_LOADED:
      return adapter.upsertMany(action.payload, {
        ...state,
        loading: false
      });

    case ChatActionTypes.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChatId: action.payload.id
      };

    case ChatActionTypes.CLEAR_CURRENT_CHAT:
      return {
        ...state,
        currentChatId: null
      };

    case ChatActionTypes.INIT_GROUP_CHAT_SOCKET:
      return {
        ...state,
        groupChatSocketInited: true
      };

    case ChatActionTypes.INIT_PRIVATE_CHAT_SOCKET:
      return {
        ...state,
        privateChatSocketInited: true
      };

    default: {
      return state;
    }
  }
}

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
