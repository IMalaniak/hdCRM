import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from '@/modules/messages/services/message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // i put here >= sign because there is more than one type of 500 error
        if (err.status >= 500) {
          this.router.navigateByUrl('/server-error');
        }

        const error = err.message || err.statusText;
        // TODO @JohnRostislavovich create logger module
        this.messageService.add(`${error}\n${err.error}`);
        return throwError(err);
      })
    );
  }
}
