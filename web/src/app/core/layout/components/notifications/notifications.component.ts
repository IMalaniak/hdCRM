import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { IconsService, MediaQueryService } from '@/core/services';
import { AppState } from '@/core/reducers';
import {
  selectDropdownVisible,
  selectIndicatorVisible,
  selectNotifications
} from '@/core/reducers/notifications/notifications.selectors';
import { closeDropdown, toggleDropdown } from '@/core/reducers/notifications/notifications.actions';
import { BS_ICONS, MAT_BUTTON, THEME_PALETTE } from '@/shared/constants';
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
  notifications$: Observable<Notification[]> = this.store$.select(selectNotifications);

  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  notificationsIcons: { [key: string]: BS_ICONS } = {
    bell: BS_ICONS.Bell,
    check: BS_ICONS.Check2All
  };

  constructor(
    private store$: Store<AppState>,
    private readonly iconsService: IconsService,
    private readonly mediaQueryService: MediaQueryService,
    private cdr: ChangeDetectorRef
  ) {
    this.iconsService.registerIcons([...Object.values(this.notificationsIcons)]);
  }

  toggleNotification(): void {
    this.store$.dispatch(toggleDropdown());
  }

  closeNotifications(): void {
    this.store$.dispatch(closeDropdown());
    this.cdr.detectChanges();
  }

  getOffsetX(): number {
    return this.mediaQueryService.isPhone ? 30 : 25;
  }
}
