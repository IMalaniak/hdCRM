import { createAction, props } from '@ngrx/store';
import { Privilege } from '../models';
import { Update } from '@ngrx/entity';
import { CollectionServiceMessage } from '@/shared/models';

const listPrefix = '[Privileges List]';
const apiPrefix = '[Privileges API]';

export const allPrivilegesRequested = createAction(`${listPrefix} Privileges List Requested`);

export const allPrivilegesRequestCanceled = createAction(`${listPrefix} Privileges List Request Canceled`);

export const allPrivilegesLoaded = createAction(
  `${apiPrefix} Privileges List Loaded`,
  props<{ response: CollectionServiceMessage<Privilege> }>()
);

export const privilegeSaved = createAction(`${listPrefix} Privilege Saved`, props<{ privilege: Update<Privilege> }>());

export const createPrivilegeRequested = createAction(
  `${listPrefix} New Privilege Creation Initialized`,
  props<{ privilege: Privilege }>()
);

export const createPrivilegeSuccess = createAction(
  `${apiPrefix} Create Privilege Success`,
  props<{ privilege: Privilege }>()
);

export const privilegeApiError = createAction(`${apiPrefix} Failed Executing Request`);
