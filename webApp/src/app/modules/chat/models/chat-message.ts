import { User } from '@/modules/users/models/user';

export class ChatMessage {
  id?: number;
  content?: string;
  sender: User;
  room: string;
  createdAt: Date;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
