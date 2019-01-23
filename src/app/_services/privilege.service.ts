import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Privilege } from '@/_models';
import { AuthenticationService } from '@/_services';

@Injectable()
export class PrivilegeService {
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  checkUserPrivilege(privilege: string) {
    const user = this.authService.currentUserValue;
    const url = `${environment.baseUrl}/users/checkUserPrivilege/${user.id}/${privilege}`;
    return this.http.get<any>(url);
  }

  getPrivilegesListForRole(roleId: number) {
    const url = `${environment.baseUrl}/privileges/list/${roleId}`;
    return this.http.get<any | Privilege[]>(url);
  }

  getFullList() {
    return this.http.get<any | Privilege[]>(`${environment.baseUrl}/privileges/list`);
  }

}
