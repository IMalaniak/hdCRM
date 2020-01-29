import { User } from '@/_modules/users/_models/user';

export interface ChatMessage {
  id?: number;
  content?: string;
  sender: User;
  room: string;
  createdAt: Date;
}
