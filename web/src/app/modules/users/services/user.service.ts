import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, State } from '../models';
import { take } from 'rxjs/operators';
import { Role } from '@/modules/roles/models';
import { SocketService } from '@/shared/services';
import { NewPassword, ApiResponse, CollectionApiResponse, ItemApiResponse } from '@/shared/models';
import { SocketEvent, APIS, CONSTANTS } from '@/shared/constants';

@Injectable()
export class UserService {
  userOnline$: Observable<any> = this.socket.onEvent(SocketEvent.ISONLINE);
  userOffline$: Observable<any> = this.socket.onEvent(SocketEvent.ISOFFLINE);
  onlineUsersListed$: Observable<any> = this.socket.onEvent(SocketEvent.USERSONLINE).pipe(take(1));

  constructor(private http: HttpClient, private socket: SocketService) {}

  getList(
    pageIndex = 0,
    pageSize = 5,
    sortIndex = CONSTANTS.ID,
    sortDirection = CONSTANTS.ASC
  ): Observable<CollectionApiResponse<User>> {
    return this.http.get<CollectionApiResponse<User>>(APIS.USERS, {
      params: new HttpParams()
        .set(CONSTANTS.PAGE_INDEX, pageIndex.toString())
        .set(CONSTANTS.PAGE_SIZE, pageSize.toString())
        .set(CONSTANTS.SORT_INDEX, sortIndex)
        .set(CONSTANTS.SORT_DIRECTION, sortDirection)
    });
  }

  listOnline() {
    this.socket.emit(SocketEvent.USERSONLINE);
  }

  getUser(id: number): Observable<ItemApiResponse<User>> {
    return this.http.get<ItemApiResponse<User>>(`${APIS.USERS}/${id}`);
  }

  updateUser(user: User): Observable<ItemApiResponse<User>> {
    return this.http.put<ItemApiResponse<User>>(`${APIS.USERS}/${user.id}`, this.formatBeforeSend(user));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${APIS.USERS}/${id}`);
  }

  inviteUsers(users: User[]): Observable<CollectionApiResponse<User>> {
    return this.http.post<CollectionApiResponse<User>>(APIS.USERS_INVITE, users);
  }

  updateUserState(user: User): Observable<ItemApiResponse<User>> {
    return this.http.put<ItemApiResponse<User>>(APIS.UPDATE_USER_STATE, user);
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
    return this.http.put<User[]>(APIS.USERS_CHANGE_STATE_OF_SELECTED, data);
  }

  changeOldPassword(data: NewPassword): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(APIS.USERS_CHANGE_PASSWORD, data, { withCredentials: true });
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
        Roles: formated.Roles.map((role) => {
          return <Role>{
            id: role.id
          };
        })
      });
    }
    return formated;
  }
}
