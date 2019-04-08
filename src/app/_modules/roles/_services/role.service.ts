import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../_models';

@Injectable()
export class RoleService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/roles';
  }

  registerRole(role) {
    return this.http.post<any>(`${this.api}/create`, role);
  }

  getRole(id: number): Observable<Role> {
    const url = `${this.api}/details/${id}`;
    return this.http.get<Role>(url);
  }

  updateRole(role): Observable<Role> {
    return this.http.put<Role>(`${this.api}/update`, role);
  }

  getRolesList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.api}/list`);
  }

  getFullList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.api}/listFull`);
  }

}
