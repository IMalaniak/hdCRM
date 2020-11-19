import { Injectable } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class MediaQueryService {
  private upToPhone: MediaQueryList = this._media.matchMedia('(max-width: 576px)');
  private upToTablet: MediaQueryList = this._media.matchMedia('(max-width: 992px)');

  constructor(private _media: MediaMatcher) {}

  get isMobileDevice(): boolean {
    return this.upToTablet.matches;
  }

  get isPhone(): boolean {
    return this.upToPhone.matches;
  }
}
