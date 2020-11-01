import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';
import { take } from 'rxjs/operators';
import { SocketService } from '@/shared/services';
import { NewPassword, ApiResponse, CollectionApiResponse, ItemApiResponse, PageQuery } from '@/shared/models';
import { SocketEvent, APIS } from '@/shared/constants';
import { Role } from '@/modules/roles';

@Injectable()
export class UserService {
  userOnline$: Observable<any> = this.socket.onEvent(SocketEvent.ISONLINE);
  userOffline$: Observable<any> = this.socket.onEvent(SocketEvent.ISOFFLINE);
  onlineUsersListed$: Observable<any> = this.socket.onEvent(SocketEvent.USERSONLINE).pipe(take(1));

  constructor(private http: HttpClient, private socket: SocketService) {}

  getList({ pageIndex, pageSize, sortIndex, sortDirection }: PageQuery): Observable<CollectionApiResponse<User>> {
    return this.http.get<CollectionApiResponse<User>>(APIS.USERS, {
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
  // changeStateOfSelected(users: User[], state: UserStates): Observable<User[]> {
  //   let userIds: number[] = [];
  //   for (const user of users) {
  //     userIds = [...userIds, user.id];
  //   }
  //   const data = {
  //     userIds: userIds,
  //     stateId: state.id
  //   };
  //   return this.http.put<User[]>(APIS.USERS_CHANGE_STATE_OF_SELECTED, data);
  // }

  changeOldPassword(data: NewPassword): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(APIS.USERS_CHANGE_PASSWORD, data, { withCredentials: true });
  }

  formatBeforeSend(user: User): User {
    let formatted = { ...user };
    if (formatted.Role) {
      const role = {
        id: user.RoleId
      } as Role;
      formatted = Object.assign({}, formatted, { Role: role });
    }
    return formatted;
  }
}
