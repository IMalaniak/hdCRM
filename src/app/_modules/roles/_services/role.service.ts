import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, RoleServerResponse } from '../_models';
import { map } from 'rxjs/operators';

@Injectable()
export class RoleService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/roles';
  }

  registerRole(role) {
    return this.http.post<any>(this.api, role);
  }

  getRole(id: number): Observable<Role> {
    const url = `${this.api}/${id}`;
    return this.http.get<Role>(url);
  }

  updateRole(role): Observable<Role> {
    return this.http.put<Role>(this.api, role);
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

}
