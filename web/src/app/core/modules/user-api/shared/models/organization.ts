import { Department } from '@/core/modules/department-api/shared';
import { Plan } from '@/core/modules/plan-api/shared';
import { Role } from '@/core/modules/role-api/shared';
import { TimeStamps } from '@/shared/models/base';
import { User } from './user';

export interface Organization extends TimeStamps {
  id: number;
  title: string;
  type: string;
  employees: string;
  country: string;
  city: string;
  address: string;
  postcode: string;
  phone: number;
  email: string;
  website: string;

  Departments: Department[];
  Plans: Plan[];
  Roles: Role[];
  Users: User[];
}
