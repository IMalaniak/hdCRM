import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { BaseCrudService, SocketService } from '@/shared/services';
import { NewPassword, BaseMessage, CollectionApiResponse } from '@/shared/models';
import { SOCKET_EVENT, API_ROUTES } from '@/shared/constants';
import { User } from '../shared';
import { Role } from '../../role-api/shared';

@Injectable()
export class UserService extends BaseCrudService {
  protected readonly url = API_ROUTES.USERS;

  userOnline$: Observable<any> = this.socket.onEvent(SOCKET_EVENT.ISONLINE);
  userOffline$: Observable<any> = this.socket.onEvent(SOCKET_EVENT.ISOFFLINE);
  onlineUsersListed$: Observable<any> = this.socket.onEvent(SOCKET_EVENT.USERSONLINE).pipe(take(1));

  constructor(protected readonly http: HttpClient, private socket: SocketService) {
    super(http);
  }

  listOnline() {
    this.socket.emit(SOCKET_EVENT.USERSONLINE);
  }

  inviteUsers(users: User[]): Observable<CollectionApiResponse<User>> {
    return this.http.post<CollectionApiResponse<User>>(API_ROUTES.USERS_INVITE, users);
  }

  changeOldPassword(data: NewPassword): Observable<BaseMessage> {
    return this.http.post<BaseMessage>(API_ROUTES.USERS_CHANGE_PASSWORD, data, { withCredentials: true });
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
