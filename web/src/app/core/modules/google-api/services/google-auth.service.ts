import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { GoogleApiService } from './google-api.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  constructor(private readonly googleApiService: GoogleApiService) {}

  public getAuth(): Observable<gapi.auth2.GoogleAuth> {
    return this.googleApiService.onLoad().pipe(mergeMap(() => this.loadGapiAuth()));
  }

  private loadGapiAuth(): Observable<gapi.auth2.GoogleAuth> {
    return new Observable((observer: Observer<gapi.auth2.GoogleAuth>) => {
      gapi.load('auth2', () => {
        gapi.auth2
          .init(this.googleApiService.getConfig())
          .then((auth: gapi.auth2.GoogleAuth) => {
            observer.next(auth);
            observer.complete();
          })
          .catch((err: any) => observer.error(err));
      });
    });
  }
}
