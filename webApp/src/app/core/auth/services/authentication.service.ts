import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@/modules/users';
import { ApiResponse, NewPassword } from '@/shared';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private authApi: string;
  private userApi: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.authApi = '/auth';
    this.userApi = '/users';
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.userApi}/profile`);
  }

  registerUser(user: User) {
    return this.http.post<any>(`${this.authApi}/register`, user);
  }

  login(loginUser: User) {
    return this.http.post<string>(`${this.authApi}/authenticate`, loginUser, { withCredentials: true });
  }

  refreshSession(): Observable<string> {
    return this.http.get<string>(`${this.authApi}/refresh-session`, { withCredentials: true });
  }

  activateAccount(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.authApi}/activate_account`, {
      token: token
    });
  }

  requestPasswordReset(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.authApi}/forgot_password`, user);
  }

  resetPassword(data: NewPassword): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.authApi}/reset_password`, data);
  }

  logout() {
    return this.http.get(`${this.authApi}/logout`, { withCredentials: true });
  }

  isTokenValid(token: string): boolean {
    return !this.jwtHelper.isTokenExpired(token);
  }

  getTokenDecoded(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }
}
