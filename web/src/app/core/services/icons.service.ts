import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { BS_ICONS, ICONS } from '@/shared/constants';

type LibFolder = 'bs-icons' | 'icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  public registerIcons(icons: (ICONS | BS_ICONS)[]): void {
    icons.forEach((icon: ICONS | BS_ICONS) => {
      this.register(icon.toString(), this.getLib(icon));
    });
  }

  private register(icon: string, lib: LibFolder): void {
    this.iconRegistry.addSvgIcon(
      icon,
      this.sanitizer.bypassSecurityTrustResourceUrl(`../../../assets/images/${lib}/${icon}.svg`)
    );
  }

  private getLib(icon: ICONS | BS_ICONS): LibFolder {
    if (Object.values(ICONS).includes(icon as ICONS)) {
      return 'icons';
    }

    return 'bs-icons';
  }
}
