import { User } from '@/modules/users/models/user';

export interface ChatMessage {
  id?: number;
  content?: string;
  sender: User;
  room: string;
  createdAt: Date;
}
