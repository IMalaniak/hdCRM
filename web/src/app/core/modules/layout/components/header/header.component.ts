import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_BUTTON, THEME_PALETTE, CommonConstants, BS_ICON } from '@/shared/constants';
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
  themeChangeIcons: { [key: string]: BS_ICON } = {
    light: BS_ICON.Sun,
    dark: BS_ICON.Moon
  };

  constructor(private readonly mediaQueryService: MediaQueryService, private readonly iconsService: IconsService) {
    this.iconsService.registerIcons([...Object.values(this.themeChangeIcons)]);
  }

  ngOnInit(): void {}

  toggleSidebar(): void {
    this.hideSidebar.emit(!this.sidebarMinimized);
  }

  themeTipMessage(): string {
    return this.enableDarkTheme ? CommonConstants.TEXTS_THEME_LIGHT : CommonConstants.TEXTS_THEME_DARK;
  }
}
