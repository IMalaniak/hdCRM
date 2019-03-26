import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

import { User, Response } from '@/_models';

const jwtHelper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get userToken(): string {
        return this.currentUserSubject.value.token;
    }

    public get loggedIn(): boolean {
        return localStorage.getItem('currentUser') !==  null;
    }

    login(loginUser: User) {
        return this.http.post<any>(`${environment.baseUrl}/users/authenticate`, loginUser)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    requestPasswordReset(user: User): Observable<Response> {
        return this.http.post<Response>(`${environment.baseUrl}/users/forgot_password`, user);
    }

    resetPassword(data: any): Observable<Response> {
        return this.http.post<Response>(`${environment.baseUrl}/users/reset_password`, data);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    validToken() {
        if (!this.loggedIn) {
            return false;
        }
        return !jwtHelper.isTokenExpired(this.userToken);
    }
}
