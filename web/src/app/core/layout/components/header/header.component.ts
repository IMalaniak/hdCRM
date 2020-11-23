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
import { IconsService } from '@/core/services';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  @Input() leftSidebarMinimized: boolean;
  @Input() enableDarkTheme: boolean;
  @Input() currentUser: User;
  @Input() canAddUser: boolean;

  @Output() hideLeftSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() enableThemeDark: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() logOut: EventEmitter<any> = new EventEmitter();

  actionLabels = ACTION_LABELS;
  buttonTypes = BUTTON_TYPE;
  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  myProfileRoute = RoutingConstants.ROUTE_MY_PROFILE;
  isShowUserMenu = false;
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

  constructor(private router: Router, private cdr: ChangeDetectorRef, private iconsService: IconsService) {
    this.iconsService.registerIcons([
      ...Object.values(this.themeChangeIcons),
      ...Object.values(this.userDropdownIcons)
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

  onLogoutClick(): void {
    this.logOut.emit();
  }

  toggleLeftSidebar(): void {
    this.hideLeftSidebar.emit(!this.leftSidebarMinimized);
  }

  themeTipMessage(): string {
    return this.enableDarkTheme ? CONSTANTS.TEXTS_THEME_LIGHT : CONSTANTS.TEXTS_THEME_DARK;
  }
}
