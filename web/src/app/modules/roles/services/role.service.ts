import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models';
import { User } from '@/modules/users/models';
import { CollectionServiceMessage, ItemServiceMessage, ServiceMessage } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable()
export class RoleService {
  constructor(private http: HttpClient) {}

  create(role: Role): Observable<ItemServiceMessage<Role>> {
    return this.http.post<ItemServiceMessage<Role>>(APIS.ROLES, this.formatBeforeSend(role));
  }

  getRole(id: number): Observable<ItemServiceMessage<Role>> {
    return this.http.get<ItemServiceMessage<Role>>(`${APIS.ROLES}/${id}`);
  }

  updateRole(role: Role): Observable<ItemServiceMessage<Role>> {
    return this.http.put<ItemServiceMessage<Role>>(`${APIS.ROLES}/${role.id}`, this.formatBeforeSend(role));
  }

  delete(id: number): Observable<ServiceMessage> {
    return this.http.delete<ServiceMessage>(`${APIS.ROLES}/${id}`);
  }

  getList(
    pageIndex = 0,
    pageSize = 5,
    sortIndex = 'id',
    sortDirection = 'asc'
  ): Observable<CollectionServiceMessage<Role>> {
    return this.http.get<CollectionServiceMessage<Role>>(APIS.ROLES, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  getDashboardData(): Observable<CollectionServiceMessage<Role>> {
    return this.http.get<CollectionServiceMessage<Role>>(APIS.ROLES_DASHBOARD);
  }

  formatBeforeSend(role: Role): Role {
    let formated = { ...role };
    if (role.Users && role.Users.length) {
      formated = Object.assign({}, formated, {
        Users: formated.Users.map((user) => {
          return <User>{
            id: user.id
          };
        })
      });
    }
    return formated;
  }
}
