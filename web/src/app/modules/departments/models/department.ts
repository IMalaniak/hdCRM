import { User } from '@/core/modules/user-api/shared';

export interface Department {
  id: number;
  title: string;
  description: string;
  managerId: number;
  Manager: User;
  createdAt: Date;
  updatedAt: Date;
  parentDepId?: number;
  ParentDepartment?: Department;
  SubDepartments?: Department[];
  Workers?: User[];
}
