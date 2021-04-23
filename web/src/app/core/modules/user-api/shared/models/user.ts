import { Department } from '@core/modules/department-api/shared';
import { Role } from '@core/modules/role-api/shared';
import { TimeStamps } from '@shared/models/base';

import { BelongsToOrganization } from './organization';
import { PasswordAttributes } from './passwordAttributes';
import { USER_STATE } from './user-state.enum';
import { UserPreferences } from './userPreferences';
import { UserSession } from './userSession';

export interface User extends TimeStamps, BelongsToOrganization {
  id: number;
  name: string;
  surname: string;
  fullname: string;
  email: string;
  phone?: string;
  password: string;
  Role: Role;
  RoleId: number;
  locale?: string;
  state: USER_STATE;
  Department?: Department;
  DepartmentId?: number;
  UserSessions: UserSession[];
  PasswordAttributes?: PasswordAttributes;
  Preference: UserPreferences;
  online: boolean;
  picture?: string;
  googleId?: string;
}
