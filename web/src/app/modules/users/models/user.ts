import { Role } from '@/modules/roles/models';
import { Department } from '@/modules/departments';
import { Asset } from '@/shared/models';
import { UserState } from '@/shared/constants';

import { UserSession } from './userSession';
import { PasswordAttributes } from './passwordAttributes';
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
  Role: Role;
  RoleId: number;
  selectedRoleIds: number[];
  defaultLang: string;
  state: UserState;
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
