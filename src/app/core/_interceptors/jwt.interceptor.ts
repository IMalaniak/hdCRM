import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first, mergeMap, catchError } from 'rxjs/operators';
import { getToken } from '../auth/store/auth.selectors';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppState } from '../reducers';
import { LogOut } from '../auth/store/auth.actions';
import Swal from 'sweetalert2';
const jwtHelper = new JwtHelperService();

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private store$: Store<AppState>) {}

    /**
     * Intercepts all HTTP requests and adds the JWT token if it is present to the request's header if the URL
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Consider only adding the auth header to API requests as this will add it to all HTTP requests.
        return this.addToken(request).pipe(
            first(),
            mergeMap((requestWithToken: HttpRequest<any>) => next.handle(requestWithToken))
        );
    }

    /**
     * Adds the JWT token to the request's header.
     */
    private addToken(request: HttpRequest<any>): Observable<HttpRequest<any>> {
        // NOTE: DO NOT try to immediately setup this selector in the constructor or as an assignment in a
        // class member variable as there's no stores available when this interceptor fires fires up and
        // as a result it'll throw a runtime error.
        return this.store$.pipe(
            select(getToken),
            first(),
            mergeMap((token: string) => {
                if (token) {
                    // if there is token - check if it is valid
                    if (this.validToken(token)) {
                        request = request.clone({
                            setHeaders: {
                                Authorization: `${token}`
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'JWT: Token has expired!',
                            type: 'error',
                            timer: 1500
                        });
                        this.store$.dispatch(new LogOut());
                    }
                }
                // if public request - do nothing
                return of(request);
            }),
        );
    }

    private validToken(token) {
        return !jwtHelper.isTokenExpired(token);
    }
}
