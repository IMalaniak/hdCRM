import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { User } from '@/modules/users';
import {
  ACTION_LABELS,
  BUTTON_TYPE,
  MAT_BUTTON,
  THEME_PALETTE,
  RoutingConstants,
  CONSTANTS,
  BS_ICONS
} from '@/shared/constants';
import { IconsService, MediaQueryService } from '@/core/services';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() sidebarMinimized: boolean;
  @Input() enableDarkTheme: boolean;
  @Input() currentUser: User;
  @Input() canAddUser: boolean;

  @Output() hideSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() enableThemeDark: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() logOut: EventEmitter<any> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  buttonTypes = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  myProfileRoute = RoutingConstants.ROUTE_MY_PROFILE;
  isShowUserMenu = false;
  isShowNotifications = false;
  breadcrumbsVisible = !this.mediaQueryService.isPhone;
  notificationsIcons: { [key: string]: BS_ICONS } = {
    bell: BS_ICONS.Bell,
    check: BS_ICONS.Check2All
  };
  themeChangeIcons: { [key: string]: BS_ICONS } = {
    light: BS_ICONS.Sun,
    dark: BS_ICONS.Moon
  };
  userDropdownIcons: { [key: string]: BS_ICONS } = {
    profile: BS_ICONS.Person,
    invite: BS_ICONS.PersonPlus,
    logOut: BS_ICONS.BoxArrowRight,
    away: BS_ICONS.Clock,
    busy: BS_ICONS.SlashCircle,
    online: BS_ICONS.AppIndicator,
    onBreak: BS_ICONS.Cup
  };

  // mock notifications
  notifications: {
    description: string;
    seen: boolean;
    date: Date;
  }[] = [
    { description: 'This is new notification', date: new Date(), seen: true },
    { description: 'Your password is going to expire soon', date: new Date(), seen: false }
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private readonly mediaQueryService: MediaQueryService,
    private readonly iconsService: IconsService
  ) {
    this.iconsService.registerIcons([
      ...Object.values(this.themeChangeIcons),
      ...Object.values(this.userDropdownIcons),
      ...Object.values(this.notificationsIcons)
    ]);
  }

  ngOnInit(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isShowUserMenu = false;
    });
  }

  closeUserMenu(): void {
    this.isShowUserMenu = false;
    this.cdr.detectChanges();
  }

  closeNotifications(): void {
    this.isShowNotifications = false;
    this.cdr.detectChanges();
  }

  onLogoutClick(): void {
    this.logOut.emit();
  }

  toggleSidebar(): void {
    this.hideSidebar.emit(!this.sidebarMinimized);
  }

  themeTipMessage(): string {
    return this.enableDarkTheme ? CONSTANTS.TEXTS_THEME_LIGHT : CONSTANTS.TEXTS_THEME_DARK;
  }

  getOffsetX(dropdown: 'notifications' | 'user'): number {
    switch (dropdown) {
      case 'notifications':
        return this.mediaQueryService.isPhone ? 30 : 25;
      case 'user':
        return this.mediaQueryService.isPhone ? 0 : 10;
    }
  }
}
