import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mergeMap, first } from 'rxjs/operators';

import { ApiRoutesConstants } from '@shared/constants';

import { getToken } from '../modules/auth/store/auth.selectors';
import { AppState } from '../store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store$: Store<AppState>) {}

  /**
   * Intercepts all HTTP requests and adds the JWT token if it is present to the request's header if the URL
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('api')) {
      return this.store$.pipe(
        select(getToken),
        first(),
        mergeMap((token: string) => {
          if (token && !request.url.includes(ApiRoutesConstants.REFRESH_SESSION)) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next.handle(request);
        })
      );
    }
    return next.handle(request);
  }
}
