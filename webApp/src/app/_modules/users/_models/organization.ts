import { Department } from '@/_modules/departments/_models';
import { Plan } from '@/_modules/planner/_models';
import { Role } from '@/_modules/roles/_models';
import { User } from './user';

export class Organization {
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

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}
