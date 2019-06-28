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
}

export class DepartmentServerResponse extends ApiResponse {
    list: Department[];
    department: Department;
    pages: number;
  
    constructor() {
      super();
      this.list = [];
      this.department = new Department();
    }
}
  