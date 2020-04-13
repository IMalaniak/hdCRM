import { Privilege } from './privilege';
import { User } from '@/modules/users/models';
import { ApiResponse } from '@/shared';

export interface Role {
  id: number;
  keyString: string;
  Privileges: Privilege[];
  Users: User[];
  createdAt: Date;
  updatedAt: Date;
  selected: boolean;
}

export interface RoleServerResponse extends ApiResponse {
  list: Role[];
  role: Role;
  pages: number;
}
