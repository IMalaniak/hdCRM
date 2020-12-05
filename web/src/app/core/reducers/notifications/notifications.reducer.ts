import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Notification } from '@/shared/models';
import * as notificationsActions from './notifications.actions';

export interface NotificationsState extends EntityState<Notification> {
  indicatorVisible: boolean;
  dropdownVisible: boolean;
}

const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>();

export const initialNotificationsState: NotificationsState = adapter.getInitialState({
  indicatorVisible: true,
  dropdownVisible: false
});

const notificationsReducer = createReducer(
  initialNotificationsState,
  on(notificationsActions.sendNotification, (state, { notification }) =>
    adapter.addOne(notification, {
      ...state,
      indicatorVisible: true
    })
  ),
  on(notificationsActions.toggleDropdown, (state) => ({
    ...state,
    dropdownVisible: !state.dropdownVisible,
    indicatorVisible: false
  })),
  on(notificationsActions.closeDropdown, (state) => ({
    ...state,
    dropdownVisible: false
  }))
);

export function reducer(state: NotificationsState | undefined, action: Action) {
  return notificationsReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();
