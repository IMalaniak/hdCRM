import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { IconsService, MediaQueryService } from '@/core/services';
import { AppState } from '@/core/store';
import {
  selectDropdownVisible,
  selectIndicatorVisible,
  selectReadNotifications,
  selectUnreadNotifications
} from '@/core/store/notifications/notifications.selectors';
import {
  closeDropdown,
  markAllAsRead,
  markAsRead,
  removeNotification,
  toggleDropdown
} from '@/core/store/notifications/notifications.actions';
import { BS_ICONS, MAT_BUTTON, NOTIFICATION_TYPES, THEME_PALETTE } from '@/shared/constants';
import { Notification } from '@/shared/models';

@Component({
  selector: 'notifications-component',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {
  isShowNotifications$: Observable<boolean> = this.store$.select(selectDropdownVisible);
  isIndicatorVisible$: Observable<boolean> = this.store$.select(selectIndicatorVisible);
  newNotifications$: Observable<Notification[]> = this.store$.select(selectUnreadNotifications);
  readNotifications$: Observable<Notification[]> = this.store$.select(selectReadNotifications);

  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  notificationTypes = NOTIFICATION_TYPES;
  notificationsIcons: { [key: string]: BS_ICONS } = {
    matMenu: BS_ICONS.ThreeDots,
    configure: BS_ICONS.Sliders,
    bell: BS_ICONS.Bell,
    doubleCheck: BS_ICONS.Check2All,
    check: BS_ICONS.Check,
    remove: BS_ICONS.X,
    typeInfo: BS_ICONS.InfoCircle,
    typeWarn: BS_ICONS.ExclamationCircle
  };

  constructor(
    private readonly store$: Store<AppState>,
    private readonly iconsService: IconsService,
    private readonly mediaQueryService: MediaQueryService
  ) {
    this.iconsService.registerIcons([...Object.values(this.notificationsIcons)]);
  }

  toggleNotification(): void {
    this.store$.dispatch(toggleDropdown());
  }

  closeNotifications(): void {
    this.store$.dispatch(closeDropdown());
  }

  markAllAsRead(): void {
    this.store$.dispatch(markAllAsRead());
  }

  markAsRead(id: string): void {
    this.store$.dispatch(markAsRead({ id }));
  }

  removeNotification(id: string): void {
    this.store$.dispatch(removeNotification({ id }));
  }

  getOffsetX(): number {
    return this.mediaQueryService.isPhone ? 52 : 5;
  }
}
