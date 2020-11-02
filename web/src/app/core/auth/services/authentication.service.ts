import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Organization } from '@/modules/users';
import { ApiResponse, NewPassword, JwtDecoded, ItemApiResponse } from '@/shared/models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APIS } from '@/shared/constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ItemApiResponse<User>> {
    return this.http.get<ItemApiResponse<User>>(APIS.USERS_PROFILE);
  }

  updateProfile(user: User): Observable<ItemApiResponse<User>> {
    return this.http.put<ItemApiResponse<User>>(APIS.USERS_PROFILE, user);
  }

  updateOrg(org: Organization): Observable<ItemApiResponse<Organization>> {
    return this.http.put<ItemApiResponse<Organization>>(`${APIS.USERS_ORGANIZATION}/${org.id}`, org);
  }

  registerUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(APIS.AUTH_REGISTER, user);
  }

  login(loginUser: User): Observable<ApiResponse | string> {
    return this.http.post<ApiResponse | string>(APIS.AUTHENTICATE, loginUser, { withCredentials: true });
  }

  refreshSession(): Observable<ApiResponse | string> {
    return this.http.get<ApiResponse | string>(APIS.REFRESH_SESSION, { withCredentials: true });
  }

  activateAccount(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(APIS.ACTIVATE_ACCOUNT, {
      token: token
    });
  }

  requestPasswordReset(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(APIS.FORGOT_PASSWORD, user);
  }

  resetPassword(data: NewPassword): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(APIS.RESET_PASSWORD, data);
  }

  logout(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(APIS.LOGOUT, { withCredentials: true });
  }

  isTokenValid(token: string): boolean {
    return !this.jwtHelper.isTokenExpired(token);
  }

  getTokenDecoded(token: string): JwtDecoded {
    return this.jwtHelper.decodeToken(token);
  }

  deleteSession(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${APIS.USERS_SESSION}/${id}`);
  }

  deleteSessionMultiple(sessionIds: number[]): Observable<ApiResponse> {
    // TODO @IMalaniak, change this to delete request with body
    return this.http.put<ApiResponse>(`${APIS.USERS_MULTIPLE_SESSION}/${1}`, { sessionIds });
  }
}
