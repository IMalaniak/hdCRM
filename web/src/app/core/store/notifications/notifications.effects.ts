import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { Action, Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { currentUserLoaded } from '@core/modules/auth/store/auth.actions';
import { NotificationsService } from '@core/services';
import { NOTIFICATION_TYPE } from '@shared/constants';
import { Notification } from '@shared/models';
import { DateUtilityService } from '@shared/services';

import { AppState } from '../index';

import * as notificationsActions from './notifications.actions';
import { selectUnreadNotifications } from './notifications.selectors';

@Injectable()
export class NotificationsEffects {
  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationsActions.markAsRead),
      map((payload) => payload.id),
      switchMap((id) => {
        const notification: Update<Notification> = {
          id,
          changes: { read: true }
        };
        this.notificationsService.markAsRead(id);
        return of(notificationsActions.markAsReadComplete({ notification }));
      })
    )
  );

  markAllAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationsActions.markAllAsRead),
      withLatestFrom(this.store$.select(selectUnreadNotifications)),
      mergeMap(([_, unreads]) => {
        const notifications: Update<Notification>[] = unreads.map((notification) => {
          this.notificationsService.markAsRead(notification.id);
          return {
            id: notification.id,
            changes: { read: true }
          };
        });
        return of(notificationsActions.markAllAsReadComplete({ notifications }));
      })
    )
  );

  removeNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(notificationsActions.removeNotification),
      map((payload) => payload.id),
      switchMap((id) => {
        this.notificationsService.remove(id);
        return of(notificationsActions.removeNotificationSuccess({ id }));
      })
    )
  );

  checkPasswordValidity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(currentUserLoaded),
      map((payload) => payload.currentUser),
      switchMap((currentUser) => {
        if (currentUser.PasswordAttributes) {
          const passwordExpireAfter: number = this.dateUtility.diffDaysFromToday(
            currentUser.PasswordAttributes.passwordExpire
          );
          if (passwordExpireAfter < 5) {
            const ignore: boolean = this.notificationsService.checkIgnore('passwordExpire');
            if (ignore) {
              return EMPTY;
            } else {
              const notification: Notification = this.notificationsService.create(
                `Your password is going to expire in ${passwordExpireAfter} day${
                  passwordExpireAfter > 1 && 's'
                }, please change your password!`,
                NOTIFICATION_TYPE.WARN
              );
              this.notificationsService.ignore({ ['passwordExpire']: this.dateUtility.addFutureDays(1) });
              return of(
                notificationsActions.sendNotification({
                  notification
                })
              );
            }
          }
        }
        return EMPTY;
      })
    )
  );

  constructor(
    private readonly store$: Store<AppState>,
    private readonly actions$: Actions,
    private readonly notificationsService: NotificationsService,
    private readonly dateUtility: DateUtilityService
  ) {}

  ngrxOnInitEffects(): Action {
    const notifications: Notification[] = this.notificationsService.getList();
    return notificationsActions.initList({ notifications });
  }
}
