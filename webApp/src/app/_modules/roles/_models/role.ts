import { Privilege } from './privilege';
import { User } from '@/_modules/users/_models';
import { ApiResponse } from '@/core/_models';

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
      if (input.Privileges && input.Privileges.length > 0) {
        this.Privileges = input.Privileges.map(privilege => {
          return new Privilege(privilege);
        });
      }
      if (input.Users && input.Users.length > 0) {
        this.Users = input.Users.map(user => {
          return new User(user);
        });
      }
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
