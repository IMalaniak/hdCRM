import { User } from '@/core/modules/user-api/shared';
import { Privilege } from './privilege';

export interface Role {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}
