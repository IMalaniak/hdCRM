import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@/_modules/users';
import { ApiResponse } from '@/core/_models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private api: string;

    constructor(private http: HttpClient) {
        this.api = '/auth';
    }

    registerUser(user: User) {
        return this.http.post<any>(`${this.api}/register`, user);
    }

    login(loginUser: User) {
        return this.http.post<any>(`${this.api}/authenticate`, loginUser).pipe(
            map(res => new User(res))
        );
    }

    activateAccount(token: string): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.api}/activate_account`, {token: token});
    }

    requestPasswordReset(user: User): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.api}/forgot_password`, user);
    }

    resetPassword(data: any): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.api}/reset_password`, data);
    }

    // TODO: logout url destroy server session

}
