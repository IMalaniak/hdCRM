import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, State } from '../models';
import { take } from 'rxjs/operators';
import { Role } from '@/modules/roles/models';
import { SocketEvent, SocketService, NewPassword, ApiResponse, CollectionApiResponse, ItemApiResponse } from '@/shared';

@Injectable()
export class UserService {
  userOnline$: Observable<any> = this.socket.onEvent(SocketEvent.ISONLINE);
  userOffline$: Observable<any> = this.socket.onEvent(SocketEvent.ISOFFLINE);
  onlineUsersListed$: Observable<any> = this.socket.onEvent(SocketEvent.USERSONLINE).pipe(take(1));

  private api = '/users';

  constructor(private http: HttpClient, private socket: SocketService) {}

  getList(
    pageIndex = 0,
    pageSize = 5,
    sortIndex = 'id',
    sortDirection = 'asc'
  ): Observable<CollectionApiResponse<User>> {
    return this.http.get<CollectionApiResponse<User>>(this.api, {
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

  getUser(id: number): Observable<ItemApiResponse<User>> {
    return this.http.get<ItemApiResponse<User>>(`${this.api}/${id}`);
  }

  updateUser(user: User): Observable<ItemApiResponse<User>> {
    return this.http.put<ItemApiResponse<User>>(`${this.api}/${user.id}`, this.formatBeforeSend(user));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.api}/${id}`);
  }

  inviteUsers(users: User[]): Observable<CollectionApiResponse<User>> {
    return this.http.post<CollectionApiResponse<User>>(`${this.api}/invite`, users);
  }

  updateUserState(user: User): Observable<ItemApiResponse<User>> {
    return this.http.put<ItemApiResponse<User>>(`${this.api}/updateUserState`, user);
  }

  // TODO @IMalaniak recreate this
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
