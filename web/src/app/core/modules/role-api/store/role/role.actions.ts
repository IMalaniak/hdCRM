import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';

import { PageQuery, CollectionApiResponse } from '@shared/models';
import { Page } from '@shared/store';

import { Role } from '../../shared/models';

const detailsPrefix = '[Role Details]';
const listPrefix = '[Roles List]';
const apiPrefix = '[Roles API]';

export const createRoleRequested = createAction('[Roles Add] Role Add Requested', props<{ role: Role }>());
export const createRoleSuccess = createAction(`${apiPrefix} Add Role Success`, props<{ role: Role }>());

export const roleRequested = createAction(`${detailsPrefix} Role Requested`, props<{ id: number }>());
export const roleLoaded = createAction(`${apiPrefix} Role Loaded`, props<{ role: Role }>());

export const updateRoleRequested = createAction(`${detailsPrefix} Update Role Requsted`, props<{ role: Role }>());
export const updateRoleSuccess = createAction(`${apiPrefix} Update Role Success`, props<{ role: Update<Role> }>());

export const deleteRoleRequested = createAction(`${listPrefix} Delete Role Requested`, props<{ id: number }>());
export const deleteRoleSuccess = createAction(`${apiPrefix} Delete Role Success`, props<{ id: number }>());

export const listPageRequested = createAction(`${listPrefix} Roles Page Requested`, props<{ page: PageQuery }>());
export const listPageLoaded = createAction(
  `${apiPrefix} Roles Page Loaded`,
  props<{ response: CollectionApiResponse<Role>; page: Page }>()
);

export const roleDashboardDataRequested = createAction('[Dashboard] Roles Data Requested');
export const roleDashboardDataLoaded = createAction(
  `${apiPrefix} Dashboard Roles Data Loaded`,
  props<{ response: CollectionApiResponse<Role> }>()
);

export const rolesApiError = createAction(`${apiPrefix} Failed Executing Request`);
