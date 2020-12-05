import { createAction, props } from '@ngrx/store';
import { Notification } from '@/shared/models';

const prefix = '[Notifications]';

export const sendNotification = createAction(`${prefix} send notification`, props<{ notification: Notification }>());

export const toggleDropdown = createAction(`${prefix} toggle notification dropdown`);
export const closeDropdown = createAction(`${prefix} close notification dropdown`);
