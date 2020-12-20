import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { BaseCrudService, SocketService } from '@/shared/services';
import { NewPassword, BaseMessage, CollectionApiResponse, ItemApiResponse } from '@/shared/models';
import { SocketEvent, APIS } from '@/shared/constants';
import { User } from '../shared';
import { Role } from '../../role-api/shared';

@Injectable()
export class UserService extends BaseCrudService {
  protected readonly url = APIS.USERS;

  userOnline$: Observable<any> = this.socket.onEvent(SocketEvent.ISONLINE);
  userOffline$: Observable<any> = this.socket.onEvent(SocketEvent.ISOFFLINE);
  onlineUsersListed$: Observable<any> = this.socket.onEvent(SocketEvent.USERSONLINE).pipe(take(1));

  constructor(protected readonly http: HttpClient, private socket: SocketService) {
    super(http);
  }

  listOnline() {
    this.socket.emit(SocketEvent.USERSONLINE);
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

  changeOldPassword(data: NewPassword): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(APIS.USERS_CHANGE_PASSWORD, data, { withCredentials: true });
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
