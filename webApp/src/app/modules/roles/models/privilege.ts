import { ApiResponse } from '@/shared';

export interface RolePrivilege {
  add: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Privilege {
  id: number;
  keyString: string;
  selected: boolean;
  RolePrivilege: RolePrivilege;
}

export interface PrivilegeServerResponse extends ApiResponse {
  list: Privilege[];
  privilege: Privilege;
  pages: number;
}
