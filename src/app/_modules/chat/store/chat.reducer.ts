import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Chat } from '../_models';
import { ChatActions, ChatActionTypes } from './chat.actions';

export interface ChatsState extends EntityState<Chat> {
  loading: boolean;
  error: string;
  currentChatId: number | null;
  chats: Chat[];
}

export const adapter: EntityAdapter<Chat> = createEntityAdapter<Chat>({});

export const initialChatsState: ChatsState = adapter.getInitialState({
  loading: false,
  error: null,
  currentChatId: null,
  chats: []
});

export function chatsReducer(
    state = initialChatsState, 
    action: ChatActions
    ): ChatsState {

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

    default: {
      return state;
    }

  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
