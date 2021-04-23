import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, filter, last, mergeMap } from 'rxjs/operators';

import { ApiRoutesConstants, RoutingConstants } from '@shared/constants';

import { redirectToLogin } from '../modules/auth/store/auth.actions';
import { AppState } from '../store';

const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [],
  excludeUrl = [ApiRoutesConstants.REFRESH_SESSION]
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
  excludeUrl?: string[];
} = {}) => (attempts: Observable<any>) =>
  attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.some((e) => e === error.status) ||
        excludeUrl.some((e) => error.url.includes(e))
      ) {
        return throwError(error);
      }
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    })
  );
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private store$: Store<AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // i put here >= sign because there is more than one type of 500 error
        if (err.status >= 500) {
          this.router.navigateByUrl(RoutingConstants.ROUTE_INTERNAL_ERROR);
        } else if (err.status === 401 && !request.url.includes(ApiRoutesConstants.REFRESH_SESSION)) {
          this.store$.dispatch(redirectToLogin());
        }

        // const error = err.message || err.statusText;
        // TODO @JohnRostislavovich create logger module
        return throwError(err);
      }),
      filter((ev) => ev.type !== 0),
      retryWhen(
        genericRetryStrategy({
          maxRetryAttempts: 2,
          scalingDuration: 1000,
          excludedStatusCodes: [500, 403, 401, 400]
        })
      ),
      last()
    );
  }
}
