import { ApiResponse } from '@/shared';

export class RolePrivilege {
  add: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}

export class Privilege {
  id: number;
  keyString: string;
  selected: boolean;
  RolePrivilege: RolePrivilege;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}

export class PrivilegeServerResponse extends ApiResponse {
  list: Privilege[];
  privilege: Privilege;
  pages: number;

  constructor() {
    super();
    this.list = [];
    this.privilege = new Privilege();
  }
}
