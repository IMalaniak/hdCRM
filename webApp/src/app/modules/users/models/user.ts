import { Role } from '@/modules/roles';
import { UserSession } from './userSession';
import { PasswordAttributes } from './passwordAttributes';
import { Department } from '@/modules/departments';
import { State } from './state';
import { Asset, ApiResponse } from '@/shared/models';
import { Organization } from './organization';
import { UserPreferences } from './UserPreferences';

export interface User {
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
  UserSessions: UserSession[];
  PasswordAttributes: PasswordAttributes;
  Organization: Organization;
  OrganizationId: number;
  online: boolean;
  lastSocketId: string;
  activeSockets?: string[];
  OrgRoom: string;
  rooms?: string[];
  Preference: UserPreferences;
}

export interface UserServerResponse extends ApiResponse {
  list: User[];
  user: User;
  pages: number;
}
