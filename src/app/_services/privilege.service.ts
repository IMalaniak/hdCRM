import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Privilege } from '@/_models';
import { AuthenticationService } from '@/_services';

@Injectable()
export class PrivilegeService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  getUserPrivileges(user) {
    const url = `${environment.baseUrl}/privileges/availableForUser/${user.id}`;
    return this.http.get<any | string[]>(url);
  }

  checkUserPrivilege(privilege: string) {
    return this.authService.currentUserPrivileges.indexOf(privilege) >= 0;
  }

  getPrivilegesListForRole(roleId: number) {
    const url = `${environment.baseUrl}/privileges/list/${roleId}`;
    return this.http.get<any | Privilege[]>(url);
  }

  getFullList() {
    return this.http.get<any | Privilege[]>(`${environment.baseUrl}/privileges/list`);
  }

}
