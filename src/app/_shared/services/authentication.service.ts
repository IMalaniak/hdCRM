import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { User } from '@/_modules/users';
import { Response } from '@/core/_models';

const jwtHelper = new JwtHelperService();

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private api: string;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.api = '/users';
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


    registerUser(user: User) {
        return this.http.post<any>(`${this.api}/register`, user);
    }

    login(loginUser: User) {
        return this.http.post<any>(`${this.api}/authenticate`, loginUser)
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

    activateAccount(token: string): Observable<Response> {
        return this.http.post<Response>(`${this.api}/activate_account`, {token: token});
    }

    requestPasswordReset(user: User): Observable<Response> {
        return this.http.post<Response>(`${this.api}/forgot_password`, user);
    }

    resetPassword(data: any): Observable<Response> {
        return this.http.post<Response>(`${this.api}/reset_password`, data);
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
