import { User } from '@/core/modules/user-api/shared';
import { TimeStamps } from '@/shared/models/base';

export interface Department extends TimeStamps {
  id: number;
  title: string;
  description: string;
  managerId: number;
  Manager: User;
  parentDepId?: number;
  ParentDepartment?: Department;
  SubDepartments?: Department[];
  Workers?: User[];
}
