import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MAT_BUTTON, THEME_PALETTE, CONSTANTS, BS_ICONS } from '@/shared/constants';
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

  @Output() hideSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() enableThemeDark: EventEmitter<boolean> = new EventEmitter<boolean>();

  matButtonTypes = MAT_BUTTON;
  themePalette = THEME_PALETTE;
  breadcrumbsVisible = !this.mediaQueryService.isPhone;
  themeChangeIcons: { [key: string]: BS_ICONS } = {
    light: BS_ICONS.Sun,
    dark: BS_ICONS.Moon
  };

  constructor(private readonly mediaQueryService: MediaQueryService, private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([...Object.values(this.themeChangeIcons)]);
  }

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.hideSidebar.emit(!this.sidebarMinimized);
  }

  themeTipMessage(): string {
    return this.enableDarkTheme ? CONSTANTS.TEXTS_THEME_LIGHT : CONSTANTS.TEXTS_THEME_DARK;
  }
}
