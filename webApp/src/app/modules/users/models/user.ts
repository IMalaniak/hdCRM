import { Role } from '@/modules/roles';
import { UserLoginHistory } from './userLoginHistory';
import { PasswordAttributes } from './passwordAttributes';
import { Department } from '@/modules/departments';
import { State } from './state';
import { Asset, ApiResponse } from '@/shared/models';
import { Organization } from './organization';

export class User {
  id: number;
  name: string;
  surname: string;
  fullname: string;
  login: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  Roles: Role[];
  selectedRoleIds: number[];
  defaultLang: string;
  StateId: number;
  State: State;
  Department: Department;
  DepartmentId: number;
  avatarId: number;
  avatar: Asset;
  selected: boolean;
  token?: string;
  lastSessionData: UserLoginHistory;
  PasswordAttributes: PasswordAttributes;
  Organization: Organization;
  OrganizationId: number;
  online: boolean;
  lastSocketId: string;
  activeSockets?: string[];
  OrgRoom: string;
  rooms?: string[];

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
      if (input.avatar) {
        this.avatar = new Asset(input.avatar);
      }
    }
  }
}

export class UserServerResponse extends ApiResponse {
  list: User[];
  user: User;
  pages: number;

  constructor(input?: any) {
    super();
    if (input) {
      Object.assign(this, input);
      if (input.list && input.list.length > 0) {
        this.list = input.list.map(user => {
          return new User(user);
        });
      }
    }
  }
}
