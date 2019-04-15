import { Role } from '@/_modules/roles';
import { State } from '@/core/_models';
import { Asset } from '@/_modules/attachments';
import { UserLoginHistory } from './userLoginHistory';
import { PasswordAttributes } from './passwordAttributes';
import { Department } from '@/_modules/departments';

export class User {
  id: number;
  name: string;
  surname: string;
  login: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  Roles: Role[];
  selectedRoleIds: number[];
  defaultLang: string;
  StateId: number;
  State: State;
  Department: Department;
  DepartmentId: number;
  avatar: Asset;
  selected: boolean;
  token?: string;
  lastSessionData: UserLoginHistory;
  PasswordAttributes: PasswordAttributes;
}
