import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@/modules/users';
import { ApiResponse, NewPassword } from '@/shared';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private api: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    this.api = '/auth';
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`/users/profile`);
  }

  registerUser(user: User) {
    return this.http.post<any>(`${this.api}/register`, user);
  }

  login(loginUser: User) {
    return this.http.post<string>(`${this.api}/authenticate`, loginUser, { withCredentials: true });
  }

  refreshSession(): Observable<string> {
    return this.http.get<string>(`${this.api}/refresh-session`, { withCredentials: true });
  }

  activateAccount(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.api}/activate_account`, {
      token: token
    });
  }

  requestPasswordReset(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.api}/forgot_password`, user);
  }

  resetPassword(data: NewPassword): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.api}/reset_password`, data);
  }

  logout() {
    return this.http.get(`${this.api}/logout`, { withCredentials: true });
  }

  isTokenValid(token: string): boolean {
    return !this.jwtHelper.isTokenExpired(token);
  }
}
