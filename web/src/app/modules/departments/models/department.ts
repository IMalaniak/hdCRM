import { User } from '@/modules/users';

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
