import { User } from './user';

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
