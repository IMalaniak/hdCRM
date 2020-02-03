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
      if (input.messages && input.messages.length > 0) {
        this.messages = input.messages.map(message => {
          return new ChatMessage(message);
        });
      }
    }
  }
}
