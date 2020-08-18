import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserServerResponse, State } from '../models';
import { take } from 'rxjs/operators';
import { Role } from '@/modules/roles/models';
import { SocketEvent, SocketService, NewPassword, ApiResponse } from '@/shared';

@Injectable()
export class UserService {
  userOnline$: Observable<any> = this.socket.onEvent(SocketEvent.ISONLINE);
  userOffline$: Observable<any> = this.socket.onEvent(SocketEvent.ISOFFLINE);
  onlineUsersListed$: Observable<any> = this.socket.onEvent(SocketEvent.USERSONLINE).pipe(take(1));

  private api = '/users';

  constructor(private http: HttpClient, private socket: SocketService) {}

  getList(pageIndex = 0, pageSize = 5, sortIndex = 'id', sortDirection = 'asc'): Observable<UserServerResponse> {
    return this.http.get<UserServerResponse>(this.api, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  listOnline() {
    this.socket.emit(SocketEvent.USERSONLINE);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/${user.id}`, this.formatBeforeSend(user));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  inviteUsers(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(`${this.api}/invite`, users);
  }

  updateUserState(user: User): Observable<User> {
    return this.http.put<User>(`${this.api}/updateUserState`, user);
  }

  changeStateOfSelected(users: User[], state: State): Observable<User[]> {
    let userIds: number[] = [];
    for (const user of users) {
      userIds = [...userIds, user.id];
    }
    const data = {
      userIds: userIds,
      stateId: state.id
    };
    return this.http.put<User[]>(`${this.api}/changeStateOfSelected`, data);
  }

  changeOldPassword(data: NewPassword): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.api}/change-password`, data);
  }

  formatBeforeSend(user: User): User {
    let formated = { ...user };
    if (formated.State) {
      const state = {
        id: user.State.id
      } as State;
      formated = Object.assign({}, formated, { State: state });
    }
    if (formated.Roles && formated.Roles.length) {
      formated = Object.assign({}, formated, {
        Roles: formated.Roles.map(role => {
          return <Role>{
            id: role.id
          };
        })
      });
    }
    return formated;
  }
}
