import { ChatMessage } from './chat-message';

export interface Chat {
  id?: number;
  room: string;
  OrgRoom: string;
  messages?: ChatMessage[];
  createdAt?: Date;
}
