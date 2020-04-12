import { User } from '@/modules/users';
import { ApiResponse } from '@/shared';

export class Department {
  id: number;
  title: string;
  description: string;
  managerId: number;
  parentDepId: number;
  createdAt: Date;
  updatedAt: Date;
  ParentDepartment: Department;
  SubDepartments: Department[];
  Workers: User[];
  Manager: User;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}

export class DepartmentServerResponse extends ApiResponse {
  list: Department[];
  department: Department;
  pages: number;

  constructor(input?: any) {
    super();
    if (input) {
      Object.assign(this, input);
    }
  }
}
