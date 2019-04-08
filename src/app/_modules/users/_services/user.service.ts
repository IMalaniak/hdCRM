import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models';
import { State } from '@/core/_models';

@Injectable()
export class UserService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/users';
  }

  // redo
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.api}/profile`);
  }

  getList(stateId?: number): Observable<User[]> {
    const url = stateId ? `${this.api}/list/${stateId}` : `${this.api}/list`;
    return this.http.get<User[]>(url);
  }

  getUser(id: number): Observable<User> {
    const url = `${this.api}/userDetails/${id}`;
    return this.http.get<User>(url);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/updateUser`, user);
  }

  updateUserState(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/updateUserState`, user);
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
    return this.http.put<User[]>(`${this.api}/changeStateOfSelected`, data);
  }

}
