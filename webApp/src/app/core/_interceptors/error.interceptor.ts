import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '@/core/auth/services';
import { MessageService } from '@/modules/messages/services/message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        // TODO @JohnRostislavovich if 500 redirect here
        if (err.status === 401) {
          // this.authenticationService.logout();
        }

        const error = err.message || err.statusText;
        // TODO @JohnRostislavovich create logger module
        this.messageService.add(`${error}\n${err.error}`);
        return throwError(err);
      })
    );
  }
}
