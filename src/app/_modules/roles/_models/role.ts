import { Privilege } from '@/core/_models';
import { User } from '@/_modules/users';

export class Role {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  createdAt: string;
  updatedAt: string;
  selected: boolean;
}
