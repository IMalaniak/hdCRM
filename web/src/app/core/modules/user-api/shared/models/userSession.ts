import { TimeStamps } from '@shared/models/base';

import { User } from '..';

export interface UserSession extends TimeStamps {
  id: number;
  IP: string;
  UA: string;
  UserId: number;
  User: User;
  isSuccess: boolean;
}
