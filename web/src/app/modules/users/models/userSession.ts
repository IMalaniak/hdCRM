import { User } from '..';

export interface UserSession {
  id: number;
  IP: string;
  UA: string;
  UserId: number;
  User: User;
  isSuccess: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
