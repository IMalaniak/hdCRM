import { User } from '..';

export interface UserSession {
  id: number;
  IP: string;
  UA: string;
  UserId: number;
  User: User;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
