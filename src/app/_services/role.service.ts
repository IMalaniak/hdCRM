// tslint:disable:max-line-length
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '@/_models';

@Injectable()
export class RoleService {
  constructor(
    private http: HttpClient
  ) { }

  registerRole(role) {
    return this.http.post<any>(`${environment.baseUrl}/roles/create`, role);
  }

  getRole(id: number) {
    const url = `${environment.baseUrl}/roles/details/${id}`;
    return this.http.get<any | Role>(url);
  }

  updateRole(role) {
    return this.http.put<any | Role>(`${environment.baseUrl}/roles/update`, role);
  }

  getRolesList() {
    return this.http.get<any | Role[]>(`${environment.baseUrl}/roles/list`);
  }

  getFullList() {
    return this.http.get<any | Role[]>(`${environment.baseUrl}/roles/listFull`);
  }

}
