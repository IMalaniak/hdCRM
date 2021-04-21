import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
  private readonly gapiUrl: string = 'https://apis.google.com/js/platform.js';
  private config: gapi.auth2.ClientConfig = {
    client_id: environment.googleClientId,
    scope: 'profile email'
  };
  private gapiLoaded: boolean;
  private script: HTMLScriptElement;
  private observers: Observer<boolean>[] = [];

  constructor() {
    this.loadGapi().subscribe();
  }

  public onLoad(): Observable<boolean> {
    return this.loadGapi();
  }

  public getConfig(): gapi.auth2.ClientConfig {
    return this.config;
  }

  private loadGapi(): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      if (this.gapiLoaded) {
        observer.next(true);
        observer.complete();
      } else if (!this.script) {
        /**
         * script element has not yet been added to document
         */
        this.script = document.createElement('script');
        this.script.async = true;
        this.script.src = this.gapiUrl;
        this.script.type = 'text/javascript';
        this.script.onload = () => {
          this.gapiLoaded = true;
          while (this.observers.length) {
            const observer = this.observers.shift();
            observer.next(true);
            observer.complete();
          }
          this.script = undefined;
        };
        this.script.onerror = () => {
          this.script = undefined;
        };
        document.getElementsByTagName('head')[0].appendChild(this.script);
      } else {
        /**
         * script is in the middle of being loaded
         */
        this.observers.push(observer);
      }
    });
  }
}
