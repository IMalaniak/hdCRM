import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, first, retryWhen, filter, last, mergeMap, finalize } from 'rxjs/operators';
import { MessageService } from '@/modules/messages/services/message.service';
import { Store, select } from '@ngrx/store';
import { AppState, selectUrl } from '../reducers';
import { refreshSession, redirectToLogin } from '../auth/store/auth.actions';

const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = []
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return throwError(error);
      }
      console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => console.log('We are done!'))
  );
};
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private messageService: MessageService, private store$: Store<AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // i put here >= sign because there is more than one type of 500 error
        if (err.status >= 500) {
          this.router.navigateByUrl('/server-error');
        } else if (err.status === 401 && !request.url.includes('refresh-session')) {
          this.store$.dispatch(refreshSession());
        } else if (err.status === 403 && request.url.includes('refresh-session')) {
          this.store$.pipe(select(selectUrl), first()).subscribe(url => {
            if (url && !url.includes('home') && !url.includes('auth')) {
              this.store$.dispatch(redirectToLogin());
            }
          });
        }

        const error = err.message || err.statusText;
        // TODO @JohnRostislavovich create logger module
        this.messageService.add(`${error}\n${err.error}`);
        return throwError(err);
      }),
      filter(ev => ev.type !== 0),
      retryWhen(
        genericRetryStrategy({
          maxRetryAttempts: 2,
          scalingDuration: 1000,
          excludedStatusCodes: [500, 403]
        })
      ),
      last()
    );
  }
}
