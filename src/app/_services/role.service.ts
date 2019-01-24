// tslint:disable:max-line-length
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '@/_models';

@Injectable()
export class RoleService {
  constructor(
    private http: HttpClient
  ) { }

  registerRole(role) {
    return this.http.post<any>(`${environment.baseUrl}/roles/create`, role);
  }

  getRole(id: number): Observable<Role> {
    const url = `${environment.baseUrl}/roles/details/${id}`;
    return this.http.get<Role>(url);
  }

  updateRole(role): Observable<Role> {
    return this.http.put<Role>(`${environment.baseUrl}/roles/update`, role);
  }

  getRolesList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.baseUrl}/roles/list`);
  }

  getFullList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.baseUrl}/roles/listFull`);
  }

}
