import { Injectable } from '@angular/core';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { Notification } from '@/shared/models';
import { AppState } from '../index';
import * as notificationsActions from './notifications.actions';
import { selectUnreadNotifications } from './notifications.selectors';

@Injectable()
export class NotificationsEffects {
  constructor(private readonly store$: Store<AppState>, private readonly actions$: Actions) {}

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationsActions.markAsRead),
      map((payload) => payload.id),
      switchMap((id) => {
        const notification: Update<Notification> = {
          id,
          changes: { read: true }
        };
        return of(notificationsActions.markAsReadComplete({ notification }));
      })
    )
  );

  markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationsActions.markAllAsRead),
      withLatestFrom(this.store$.select(selectUnreadNotifications)),
      mergeMap(([_, unreads]) => {
        const notifications: Update<Notification>[] = unreads.map((notification) => ({
          id: notification.id,
          changes: { read: true }
        }));
        return of(notificationsActions.markAllAsReadComplete({ notifications }));
      })
    )
  );

  // TODO: remove from db?
  removeNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationsActions.removeNotification),
      map((payload) => payload.id),
      switchMap((id) => {
        return of(notificationsActions.removeNotificationSuccess({ id }));
      })
    )
  );
}
