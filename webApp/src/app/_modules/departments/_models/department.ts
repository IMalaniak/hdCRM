import { User } from '@/_modules/users';
import { ApiResponse } from '@/core/_models';

export class Department {
  id: number;
  title: string;
  description: string;
  managerId: number;
  parentDepId: number;
  createdAt: string;
  updatedAt: string;
  ParentDepartment: Department;
  SubDepartments: Department[];
  Workers: User[];
  Manager: User;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
      if (input.ParentDepartment) {
        this.ParentDepartment = new Department(input.ParentDepartment);
      }
      if (input.SubDepartments && input.SubDepartments.length > 0) {
        this.SubDepartments = input.SubDepartments.map(department => {
          return new Department(department);
        });
      }
      if (input.Workers && input.Workers.length > 0) {
        this.Workers = input.Workers.map(user => {
          return new User(user);
        });
      }
      if (input.Manager) {
        this.Manager = new User(input.Manager);
      }
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
      if (input.list && input.list.length > 0) {
        this.list = input.list.map(department => {
          return new Department(department);
        });
      }
    }
  }
}
