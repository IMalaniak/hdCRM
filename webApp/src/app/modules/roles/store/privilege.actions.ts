import { createAction, props } from '@ngrx/store';
import { Privilege } from '../models';
import { Update } from '@ngrx/entity';
import { CollectionApiResponse } from '@/shared/models';

export const allPrivilegesRequested = createAction('[Privileges List] Privileges List Requested');

export const allPrivilegesRequestCanceled = createAction('[Privileges List] Privileges List Request Canceled');

export const allPrivilegesLoaded = createAction(
  '[Privileges API] Privileges List Loaded',
  props<{ response: CollectionApiResponse<Privilege> }>()
);

export const privilegeSaved = createAction(
  '[Privileges Dialog Window] Privilege Saved',
  props<{ privilege: Update<Privilege> }>()
);

export const createPrivilege = createAction(
  '[Privileges Dialog Window] New Privilege Creation Initialized',
  props<{ privilege: Privilege }>()
);

export const createPrivilegeSuccess = createAction(
  '[Privileges API] Create Privilege Success',
  props<{ privilege: Privilege }>()
);

export const privilegeApiError = createAction('[Privileges API] Failed Executing Request');
