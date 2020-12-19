import { Department } from '@/core/modules/department-api/shared';
import { Plan } from '@/core/modules/plan-api/shared';
import { Role } from '@/core/modules/role-api/shared';
import { User } from './user';

export interface Organization {
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

  createdAt: Date;
  updatedAt: Date;

  Departments: Department[];
  Plans: Plan[];
  Roles: Role[];
  Users: User[];
}
