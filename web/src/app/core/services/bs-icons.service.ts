import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class BsIconsService {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {}

  public registerIcons(icons: string[]): void {
    icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`../../../assets/images/bs-icons/${icon}.svg`)
      );
    });
  }
}
