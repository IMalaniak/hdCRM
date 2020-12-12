import { Injectable } from '@angular/core';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import { Action, Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { currentUserLoaded } from '@/core/auth/store/auth.actions';
import { Notification } from '@/shared/models';
import { NOTIFICATION_TYPES } from '@/shared/constants';
import { AppState } from '../index';
import * as notificationsActions from './notifications.actions';
import { selectUnreadNotifications } from './notifications.selectors';
import { NotificationsService } from '@/core/services';

@Injectable()
export class NotificationsEffects {
  constructor(
    private readonly store$: Store<AppState>,
    private readonly actions$: Actions,
    private readonly notificationsService: NotificationsService
  ) {}

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

  checkPasswordValidity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentUserLoaded),
      map((payload) => payload.currentUser),
      switchMap((currentUser) => {
        // Discard the time and time-zone information.
        const passwordExpire = new Date(currentUser.PasswordAttributes.passwordExpire);
        const currentDate = new Date();
        const utc1 = Date.UTC(passwordExpire.getFullYear(), passwordExpire.getMonth(), passwordExpire.getDate());
        const utc2 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        const passwordExpireAfter = Math.floor((utc1 - utc2) / _MS_PER_DAY);
        if (passwordExpireAfter < 5) {
          const ignore = this.notificationsService.checkIgnore('passwordExpire');
          if (ignore) {
            return EMPTY;
          } else {
            const notification = this.notificationsService.create(
              `Your password is going to expire in ${passwordExpireAfter} days, please change your password!`,
              NOTIFICATION_TYPES.WARN
            );
            const ignoreExpire = new Date();
            ignoreExpire.setDate(currentDate.getDate() + 1);
            this.notificationsService.ignore({ ['passwordExpire']: ignoreExpire });
            return of(
              notificationsActions.sendNotification({
                notification
              })
            );
          }
        }
        return EMPTY;
      })
    )
  );

  ngrxOnInitEffects(): Action {
    const notifications: Notification[] = this.notificationsService.getList();
    return notificationsActions.initList({ notifications });
  }
}
