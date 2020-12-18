import { Department } from '@/core/modules/department-api/shared';
import { Plan } from '@/modules/planner/models';
import { Role } from '@/modules/roles/models';
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
