import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { BS_ICON, ICON } from '@/shared/constants';

type LibFolder = 'bs-icons' | 'icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  public registerIcons(icons: (ICON | BS_ICON)[]): void {
    icons.forEach((icon: ICON | BS_ICON) => {
      this.register(icon.toString(), this.getLib(icon));
    });
  }

  private register(icon: string, lib: LibFolder): void {
    this.iconRegistry.addSvgIcon(
      icon,
      this.sanitizer.bypassSecurityTrustResourceUrl(`../../../assets/images/${lib}/${icon}.svg`)
    );
  }

  private getLib(icon: ICON | BS_ICON): LibFolder {
    if (Object.values(ICON).includes(icon as ICON)) {
      return 'icons';
    }

    return 'bs-icons';
  }
}
