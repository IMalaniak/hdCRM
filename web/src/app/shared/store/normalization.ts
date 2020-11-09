import { createAction, props } from '@ngrx/store';
import { normalize, schema } from 'normalizr';

import { Department } from '@/modules/departments';
import { Plan } from '@/modules/planner';
import { Role } from '@/modules/roles';
import { User } from '@/modules/users';
import { CollectionApiResponse, ItemApiResponse } from '../models';

interface Collections {
  Users?: User[];
  Roles?: Role[];
  Departments?: Department[];
  Plans?: Plan[];
}

export const userSchema = new schema.Entity<User>('Users', {});

export const roleSchema = new schema.Entity<Role>('Roles', {
  Users: [userSchema]
});

export const roleListSchema = new schema.Array<Role>(roleSchema);

export const partialDataLoaded = createAction('[API] Partial Data loaded', props<Collections>());

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
