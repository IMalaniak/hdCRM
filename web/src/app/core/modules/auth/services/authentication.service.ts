import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User, Organization } from '@core/modules/user-api/shared';
import { ApiRoutesConstants } from '@shared/constants';
import { BaseMessage, NewPassword, ItemApiResponse } from '@shared/models';

import { AuthResponse } from '../shared';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<ItemApiResponse<User>> {
    return this.http.get<ItemApiResponse<User>>(ApiRoutesConstants.USERS_PROFILE);
  }

  updateProfile(user: User): Observable<ItemApiResponse<User>> {
    return this.http.put<ItemApiResponse<User>>(ApiRoutesConstants.USERS_PROFILE, user);
  }

  updateOrg(org: Organization): Observable<ItemApiResponse<Organization>> {
    return this.http.put<ItemApiResponse<Organization>>(`${ApiRoutesConstants.USERS_ORGANIZATION}/${org.id}`, org);
  }

  registerUser(user: User): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(ApiRoutesConstants.AUTH_REGISTER, user);
  }

  authenticate(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(ApiRoutesConstants.AUTHENTICATE, user, { withCredentials: true });
  }

  googleOauth(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      ApiRoutesConstants.OAUTH_GOOGLE,
      { id_token: token },
      { withCredentials: true }
    );
  }

  refreshSession(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(ApiRoutesConstants.REFRESH_SESSION, { withCredentials: true });
  }

  activateAccount(token: string): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(ApiRoutesConstants.ACTIVATE_ACCOUNT, {
      token
    });
  }

  requestPasswordReset(user: User): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(ApiRoutesConstants.FORGOT_PASSWORD, user);
  }

  resetPassword(data: NewPassword): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(ApiRoutesConstants.RESET_PASSWORD, data);
  }

  logout(): Observable<BaseMessage> {
    return this.http.get<BaseMessage>(ApiRoutesConstants.LOGOUT, { withCredentials: true });
  }

  deleteSession(id: number): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(`${ApiRoutesConstants.USERS_SESSION}/${id}`);
  }

  deleteSessionMultiple(sessionIds: number[]): Observable<BaseMessage> {
    // TODO @IMalaniak, change this to delete request with body
    return this.http.put<BaseMessage>(`${ApiRoutesConstants.USERS_MULTIPLE_SESSION}/${1}`, { sessionIds });
  }
}
