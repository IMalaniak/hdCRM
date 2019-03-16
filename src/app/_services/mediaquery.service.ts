import { Injectable } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class MediaqueryService {
  private upToTablet: MediaQueryList;
  private upToPhone: MediaQueryList;

  constructor(private media: MediaMatcher) {
    this.upToTablet = this.media.matchMedia('(max-width: 992px)');
    this.upToPhone = this.media.matchMedia('(max-width: 576px)');
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
