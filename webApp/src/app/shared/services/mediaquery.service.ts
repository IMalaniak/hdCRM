import { Injectable } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class MediaqueryService {
  private upToPhone: MediaQueryList = this.media.matchMedia('(max-width: 576px)');
  private upToTablet: MediaQueryList = this.media.matchMedia('(max-width: 992px)');
  popupDefaultOptions: MatDialogConfig;

  constructor(private media: MediaMatcher) {}

  public get deFaultPopupSize(): MatDialogConfig {
    let config: MatDialogConfig = {
      height: '75vh',
      width: '80%'
    };
    if (this.upToPhone.matches) {
      config = {
        height: '99vh',
        width: '99vw',
        maxWidth: '99vw'
      };
    }
    return config;
  }

  public get smallPopupSize(): MatDialogConfig {
    let config: MatDialogConfig = {
      height: 'fit-content',
      width: '40wv'
    };
    if (this.upToPhone.matches) {
      config = {
        height: 'fit-content',
        width: '90vw',
        maxWidth: '90vw'
      };
    }
    return config;
  }

  public get isMobileDevice(): boolean {
    return this.upToTablet.matches;
  }

  public get isTablet(): boolean {
    return this.upToTablet.matches;
  }

  public get isPhone(): boolean {
    return this.upToPhone.matches;
  }
}
