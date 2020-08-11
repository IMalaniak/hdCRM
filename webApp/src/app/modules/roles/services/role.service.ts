import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleServerResponse } from '../models';
import { User } from '@/modules/users/models';

@Injectable()
export class RoleService {
  private api = '/roles';

  constructor(private http: HttpClient) {}

  create(role: Role) {
    return this.http.post<any>(this.api, this.formatBeforeSend(role));
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.api}/${id}`);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.api}/${role.id}`, this.formatBeforeSend(role));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  getList(pageIndex = 0, pageSize = 5, sortIndex = 'id', sortDirection = 'asc'): Observable<RoleServerResponse> {
    return this.http.get<RoleServerResponse>(this.api, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  getDashboardData(): Observable<RoleServerResponse> {
    return this.http.get<RoleServerResponse>(`${this.api}/dashboard`);
  }

  formatBeforeSend(role: Role): Role {
    let formated = { ...role };
    if (role.Users && role.Users.length) {
      formated = Object.assign({}, formated, {
        Users: formated.Users.map(user => {
          return <User>{
            id: user.id
          };
        })
      });
    }
    return formated;
  }
}
