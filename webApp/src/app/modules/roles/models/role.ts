import { Privilege } from './privilege';
import { User } from '@/modules/users/models';
import { ApiResponse } from '@/shared';

export class Role {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  createdAt: Date;
  updatedAt: Date;
  selected: boolean;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}

export class RoleServerResponse extends ApiResponse {
  list: Role[];
  role: Role;
  pages: number;

  constructor(input?: any) {
    super();
    if (input) {
      Object.assign(this, input);
    }
  }
}
