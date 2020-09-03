import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models';
import { User } from '@/modules/users/models';
import { CollectionApiResponse, ItemApiResponse, ApiResponse } from '@/shared/models';

@Injectable()
export class RoleService {
  private api = '/roles';

  constructor(private http: HttpClient) {}

  create(role: Role): Observable<ItemApiResponse<Role>> {
    return this.http.post<ItemApiResponse<Role>>(this.api, this.formatBeforeSend(role));
  }

  getRole(id: number): Observable<ItemApiResponse<Role>> {
    return this.http.get<ItemApiResponse<Role>>(`${this.api}/${id}`);
  }

  updateRole(role: Role): Observable<ItemApiResponse<Role>> {
    return this.http.put<ItemApiResponse<Role>>(`${this.api}/${role.id}`, this.formatBeforeSend(role));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.api}/${id}`);
  }

  getList(
    pageIndex = 0,
    pageSize = 5,
    sortIndex = 'id',
    sortDirection = 'asc'
  ): Observable<CollectionApiResponse<Role>> {
    return this.http.get<CollectionApiResponse<Role>>(this.api, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  getDashboardData(): Observable<CollectionApiResponse<Role>> {
    return this.http.get<CollectionApiResponse<Role>>(`${this.api}/dashboard`);
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
