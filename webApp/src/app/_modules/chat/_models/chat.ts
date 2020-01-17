import { ChatMessage } from './chat-message';

export interface Chat {
  id: number;
  room: string;
  messages?: ChatMessage[];
  createdAt: Date;
}
