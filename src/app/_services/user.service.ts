import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getProfile() {
    return this.http.get<any>(`${environment.baseUrl}/users/profile`);
  }

  getList(stateId?: number) {
    const url = stateId ? `${environment.baseUrl}/users/list/${stateId}` : `${environment.baseUrl}/users/list`;
    return this.http.get<any | User[]>(url);
  }

  getUser(id: number) {
    const url = `${environment.baseUrl}/users/userDetails/${id}`;
    return this.http.get<any | User>(url);
  }

  updateUser(user: User) {
    return this.http.put<any | User>(`${environment.baseUrl}/users/updateUser`, user);
  }

  updateUserState(user: User) {
    return this.http.put<any | User>(`${environment.baseUrl}/users/updateUserState`, user);
  }

  changeStateOfSelected(users: User[], state: State) {
    const userIds = [];
    for (const user of users) {
      userIds.push(user.id);
    }
    const data = {
      userIds: userIds,
      stateId: state.id
    };
    return this.http.put<any | User[]>(`${environment.baseUrl}/users/changeStateOfSelected`, data);
  }

}
