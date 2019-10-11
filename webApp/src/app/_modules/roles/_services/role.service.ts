import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleServerResponse, Privilege } from '../_models';
import { map } from 'rxjs/operators';
import { User } from '@/_modules/users/_models';

@Injectable()
export class RoleService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/roles';
  }

  registerRole(role: Role) {
    return this.http.post<any>(this.api, role);
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.api}/${id}`);
  }

  updateRole(role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.api}/${role.id}`, this.formatBeforeSend(role));
  }

  getList(pageIndex = 0, pageSize = 5, sortIndex = 'id', sortDirection = 'asc'): Observable<RoleServerResponse> {
    return this.http.get<RoleServerResponse>(this.api, {
      params: new HttpParams()
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('sortIndex', sortIndex)
          .set('sortDirection', sortDirection)
      }).pipe(
        map(res => new RoleServerResponse(res))
      );
  }

  formatBeforeSend(role: Role): Role {
    if (role.Users) {
      role.Users = role.Users.map(user => {
        return new User({
          id: user.id
        });
      });
    }
    return role;
  }

}
