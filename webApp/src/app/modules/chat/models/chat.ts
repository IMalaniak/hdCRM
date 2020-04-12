import { ChatMessage } from './chat-message';

export class Chat {
  id?: number;
  room: string;
  OrgRoom: string;
  messages?: ChatMessage[];
  createdAt?: Date;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
