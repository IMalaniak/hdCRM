import { Department } from '@/core/modules/department-api/shared';
import { Role } from '@/core/modules/role-api/shared';
import { Asset } from '@/shared/models';
import { UserState } from '@/shared/constants';

import { UserSession } from './userSession';
import { PasswordAttributes } from './passwordAttributes';
import { Organization } from './organization';
import { UserPreferences } from './UserPreferences';
import { TimeStamps } from '@/shared/models/base';

export interface User extends TimeStamps {
  id: number;
  name: string;
  surname: string;
  fullname: string;
  login: string;
  email: string;
  phone: string;
  password: string;
  Role: Role;
  RoleId: number;
  defaultLang: string;
  state: UserState;
  Department: Department;
  DepartmentId: number;
  avatarId: number;
  avatar: Asset;
  UserSessions: UserSession[];
  PasswordAttributes: PasswordAttributes;
  Organization: Organization;
  OrganizationId: number;
  online: boolean;
  Preference: UserPreferences;
}
