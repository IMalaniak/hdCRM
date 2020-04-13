import { User } from '@/modules/users';
import { ApiResponse } from '@/shared';

export interface Department {
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
}

export interface DepartmentServerResponse extends ApiResponse {
  list: Department[];
  department: Department;
  pages: number;
}
