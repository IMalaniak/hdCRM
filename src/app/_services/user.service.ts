import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, State } from '@/_models';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  registerUser(user: User) {
    return this.http.post<any>(`${environment.baseUrl}/users/register`, user);
  }

  // redo
  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/users/profile`);
  }

  getList(stateId?: number): Observable<User[]> {
    const url = stateId ? `${environment.baseUrl}/users/list/${stateId}` : `${environment.baseUrl}/users/list`;
    return this.http.get<User[]>(url);
  }

  getUser(id: number): Observable<User> {
    const url = `${environment.baseUrl}/users/userDetails/${id}`;
    return this.http.get<User>(url);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${environment.baseUrl}/users/updateUser`, user);
  }

  updateUserState(user: User): Observable<User> {
    return this.http.put<User>(`${environment.baseUrl}/users/updateUserState`, user);
  }

  changeStateOfSelected(users: User[], state: State): Observable<User[]> {
    const userIds = [];
    for (const user of users) {
      userIds.push(user.id);
    }
    const data = {
      userIds: userIds,
      stateId: state.id
    };
    return this.http.put<User[]>(`${environment.baseUrl}/users/changeStateOfSelected`, data);
  }

}
