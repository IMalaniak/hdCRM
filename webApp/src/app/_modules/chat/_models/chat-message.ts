import { User } from '@/_modules/users/_models/user';

export class ChatMessage {
  id?: number;
  content?: string;
  sender: User;
  room: string;
  createdAt: Date;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
      if (input.sender) {
        this.sender = new User(input.sender);
      }
    }
  }
}
