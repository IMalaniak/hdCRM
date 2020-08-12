import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Privilege, PrivilegeServerResponse } from '../models';

@Injectable()
export class PrivilegeService {
  private api = '/privileges';

  constructor(private http: HttpClient) {}

  create(privilege: Privilege): Observable<Privilege> {
    return this.http.post<Privilege>(this.api, privilege);
  }

  getUserPrivileges(user): Observable<string[]> {
    const url = `${this.api}/availableForUser/${user.id}`;
    return this.http.get<string[]>(url);
  }

  getPrivilegesListForRole(roleId: number): Observable<Privilege[]> {
    const url = `${this.api}/${roleId}`;
    return this.http.get<Privilege[]>(url);
  }

  getFullList(): Observable<PrivilegeServerResponse> {
    return this.http.get<PrivilegeServerResponse>(this.api);
  }
}
