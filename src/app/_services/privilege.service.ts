import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Privilege } from '@/_models';
import { AuthenticationService } from '@/_services';

@Injectable()
export class PrivilegeService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  getUserPrivileges(user): Observable<string[]> {
    const url = `${environment.baseUrl}/privileges/availableForUser/${user.id}`;
    return this.http.get<any | string[]>(url);
  }

  checkUserPrivilege(privilege: string): boolean {
    if (this.authService.currentUserPrivileges) {
      return this.authService.currentUserPrivileges.indexOf(privilege) >= 0;
    }
    return false;
  }

  getPrivilegesListForRole(roleId: number): Observable<Privilege[]> {
    const url = `${environment.baseUrl}/privileges/list/${roleId}`;
    return this.http.get<Privilege[]>(url);
  }

  getFullList(): Observable<Privilege[]> {
    return this.http.get<Privilege[]>(`${environment.baseUrl}/privileges/list`);
  }

}
