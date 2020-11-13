import { Privilege } from './privilege';
import { User } from '@/modules/users/models';

export interface Role {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  createdAt: Date;
  updatedAt: Date;
  selected?: boolean;
}
