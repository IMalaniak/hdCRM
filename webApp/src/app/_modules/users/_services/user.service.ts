import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserServerResponse, State } from '../_models';
import { map } from 'rxjs/operators';
import { Role } from '@/_modules/roles/_models';

@Injectable()
export class UserService {
  private api: string;

  constructor(private http: HttpClient) {
    this.api = '/users';
  }

  // redo
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.api}/profile`);
  }

  getList(pageIndex = 0, pageSize = 5, sortIndex = 'id', sortDirection = 'asc'): Observable<UserServerResponse> {
    return this.http
      .get<UserServerResponse>(this.api, {
        params: new HttpParams()
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('sortIndex', sortIndex)
          .set('sortDirection', sortDirection)
      })
      .pipe(map(res => new UserServerResponse(res)));
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`).pipe(map(res => new User(res)));
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/${user.id}`, this.formatBeforeSend(user));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
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

  formatBeforeSend(user: User): User {
    if (user.State) {
      const state = new State({
        id: user.State.id
      });
      user.State = state;
    }
    if (user.Roles) {
      user.Roles = user.Roles.map(role => {
        return new Role({
          id: role.id
        });
      });
    }
    return user;
  }
}
