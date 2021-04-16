import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap, first } from 'rxjs/operators';

import { ApiRoutesConstants } from '@shared/constants';

import { getToken, getTokenType } from '../modules/auth/store/auth.selectors';
import { AppState } from '../store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store$: Store<AppState>) {}

  /**
   * Intercepts all HTTP requests and adds the JWT token if it is present to the request's header if the URL
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('api')) {
      return combineLatest([this.store$.pipe(select(getToken)), this.store$.pipe(select(getTokenType))]).pipe(
        first(),
        mergeMap(([token, tokenType]) => {
          if (token && !request.url.includes(ApiRoutesConstants.REFRESH_SESSION)) {
            request = request.clone({
              setHeaders: {
                Authorization: `${tokenType} ${token}`
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
