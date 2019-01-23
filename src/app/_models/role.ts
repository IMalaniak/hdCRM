import { Privilege } from './privilege';
import { User } from './user';

export class Role {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  createdAt: string;
  updatedAt: string;
  selected: boolean;
}
