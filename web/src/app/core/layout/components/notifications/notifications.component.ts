import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { BS_ICONS, MAT_BUTTON, THEME_PALETTE } from '@/shared/constants';
import { IconsService, MediaQueryService } from '@/core/services';

@Component({
  selector: 'notifications-component',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {
  isShowNotifications = false;

  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  notificationsIcons: { [key: string]: BS_ICONS } = {
    bell: BS_ICONS.Bell,
    check: BS_ICONS.Check2All
  };

  // mock notifications
  notifications: {
    description: string;
    seen: boolean;
    date: Date;
  }[] = [
    // { description: 'This is new notification', date: new Date(), seen: true },
    // { description: 'Your password is going to expire soon', date: new Date(), seen: false }
  ];

  constructor(
    private readonly iconsService: IconsService,
    private readonly mediaQueryService: MediaQueryService,
    private cdr: ChangeDetectorRef
  ) {
    this.iconsService.registerIcons([...Object.values(this.notificationsIcons)]);
  }

  closeNotifications(): void {
    this.isShowNotifications = false;
    this.cdr.detectChanges();
  }

  getOffsetX(): number {
    return this.mediaQueryService.isPhone ? 30 : 25;
  }
}
