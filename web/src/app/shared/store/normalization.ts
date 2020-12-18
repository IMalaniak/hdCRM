import { createAction, props } from '@ngrx/store';
import { normalize, schema } from 'normalizr';

import { User } from '@/core/modules/user-api/shared';
import { Department } from '@/modules/departments';
import { Plan } from '@/modules/planner';
import { Role } from '@/modules/roles';
import { CollectionApiResponse, ItemApiResponse } from '../models';

interface Collections {
  Users?: User[];
  Roles?: Role[];
  Departments?: Department[];
  Plans?: Plan[];
}

export const partialDataLoaded = createAction('[API] Partial Data loaded', props<Collections>());

// Schemas:
export const userSchema = new schema.Entity<User>('Users', {});
export const userListSchema = new schema.Array<User>(userSchema);

export const roleSchema = new schema.Entity<Role>('Roles', {
  Users: userListSchema
});
export const roleListSchema = new schema.Array<Role>(roleSchema);

export const planSchema = new schema.Entity<Plan>('Plans', {
  Creator: userSchema,
  Participants: userListSchema
});
export const planListSchema = new schema.Array<Role>(planSchema);

export const departmentSchema = new schema.Entity<Department>('Departments', {
  Manager: userSchema,
  Workers: userListSchema
});
export const departmentListSchema = new schema.Array<Department>(departmentSchema);
departmentSchema.define({ ParentDepartment: departmentSchema, SubDepartments: departmentListSchema });

export function normalizeResponse<T>(
  response: CollectionApiResponse<T> | ItemApiResponse<T>,
  schema: schema.Array<T> | schema.Entity
): Collections {
  const {
    entities: { Departments, Plans, Roles, Users }
  } = normalize(response.data, schema);

  return {
    ...(Departments && { Departments: Object.values(Departments) }),
    ...(Plans && { Plans: Object.values(Plans) }),
    ...(Roles && { Roles: Object.values(Roles) }),
    ...(Users && { Users: Object.values(Users) })
  };
}
