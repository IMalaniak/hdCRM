import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Notification } from '@/shared/models';

const prefix = '[Notifications]';

export const sendNotification = createAction(`${prefix} send notification`, props<{ notification: Notification }>());

export const toggleDropdown = createAction(`${prefix} toggle notification dropdown`);
export const closeDropdown = createAction(`${prefix} close notification dropdown`);

export const markAsRead = createAction(`${prefix} mark notification as read`, props<{ id: number }>());
export const markAsReadComplete = createAction(
  `${prefix} mark all notification as read complete`,
  props<{ notification: Update<Notification> }>()
);

export const markAllAsRead = createAction(`${prefix} mark all notifications as read`);
export const markAllAsReadComplete = createAction(
  `${prefix} mark all notifications as read complete`,
  props<{ notifications: Update<Notification>[] }>()
);

export const removeNotification = createAction(`${prefix} remove notification`, props<{ id: number }>());
export const removeNotificationSuccess = createAction(`${prefix} remove notification success`, props<{ id: number }>());
