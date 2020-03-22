import { createAction, props } from '@ngrx/store';
import { PrivilegeServerResponse, Privilege } from '../models';
import { Update } from '@ngrx/entity';

export const allPrivilegesRequested = createAction(
  '[Privileges List] Privileges List Requested'
);

export const allPrivilegesRequestCanceled = createAction(
  '[Privileges List] Privileges List Request Canceled',
);

export const allPrivilegesLoaded = createAction(
  '[Privileges API] Privileges List Loaded',
  props<{ response: PrivilegeServerResponse }>()
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

export const createPrivilegeFail = createAction(
  '[Privileges API] Create Privilege Fail',
  props<{ error: string }>()
);
