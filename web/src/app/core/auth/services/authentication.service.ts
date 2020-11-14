import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Organization } from '@/modules/users';
import { BaseMessage, NewPassword, JwtDecoded, ItemApiResponse } from '@/shared/models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { APIS } from '@/shared/constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(APIS.USERS_PROFILE);
  }

  updateProfile(user: User): Observable<ItemApiResponse<User>> {
    return this.http.put<ItemApiResponse<User>>(APIS.USERS_PROFILE, user);
  }

  updateOrg(org: Organization): Observable<ItemApiResponse<Organization>> {
    return this.http.put<ItemApiResponse<Organization>>(`${APIS.USERS_ORGANIZATION}/${org.id}`, org);
  }

  registerUser(user: User): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(APIS.AUTH_REGISTER, user);
  }

  login(loginUser: User): Observable<BaseMessage | string> {
    return this.http.post<BaseMessage | string>(APIS.AUTHENTICATE, loginUser, { withCredentials: true });
  }

  refreshSession(): Observable<BaseMessage | string> {
    return this.http.get<BaseMessage | string>(APIS.REFRESH_SESSION, { withCredentials: true });
  }

  activateAccount(token: string): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(APIS.ACTIVATE_ACCOUNT, {
      token: token
    });
  }

  requestPasswordReset(user: User): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(APIS.FORGOT_PASSWORD, user);
  }

  resetPassword(data: NewPassword): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(APIS.RESET_PASSWORD, data);
  }

  logout(): Observable<BaseMessage> {
    return this.http.get<BaseMessage>(APIS.LOGOUT, { withCredentials: true });
  }

  isTokenValid(token: string): boolean {
    return !this.jwtHelper.isTokenExpired(token);
  }

  getTokenDecoded(token: string): JwtDecoded {
    return this.jwtHelper.decodeToken(token);
  }

  deleteSession(id: number): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(`${APIS.USERS_SESSION}/${id}`);
  }

  deleteSessionMultiple(sessionIds: number[]): Observable<BaseMessage> {
    // TODO @IMalaniak, change this to delete request with body
    return this.http.put<BaseMessage>(`${APIS.USERS_MULTIPLE_SESSION}/${1}`, { sessionIds });
  }
}
