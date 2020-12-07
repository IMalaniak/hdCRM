import { createSelector } from '@ngrx/store';
import { AppState } from '..';
import * as fromNotifications from './notifications.reducer';

export const selectNotificationsState = (state: AppState) => state.notifications;

export const selectNotifications = createSelector(selectNotificationsState, fromNotifications.selectAll);
export const selectReadNotifications = createSelector(selectNotifications, (notifications) =>
  notifications.filter((notification) => notification.read)
);
export const selectUnreadNotifications = createSelector(selectNotifications, (notifications) =>
  notifications?.filter((notification) => !notification.read)
);

export const selectIndicatorVisible = createSelector(selectNotificationsState, (state) => state.indicatorVisible);

export const selectDropdownVisible = createSelector(selectNotificationsState, (state) => state.dropdownVisible);
