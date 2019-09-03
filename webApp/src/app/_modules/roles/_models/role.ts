import { Privilege } from './privilege';
import { User } from '@/_modules/users';
import { ApiResponse } from '@/core/_models';

export class Role {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  createdAt: string;
  updatedAt: string;
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
      if (input.list && input.list.length > 0) {
        this.list = input.list.map(role => {
          return new Role(role);
        });
      }
    }
  }
}
