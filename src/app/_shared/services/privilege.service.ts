import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Privilege } from '@/core/_models';

@Injectable()
export class PrivilegeService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/privileges';
  }

  getUserPrivileges(user): Observable<string[]> {
    const url = `${this.api}/availableForUser/${user.id}`;
    return this.http.get<string[]>(url);
  }

  getPrivilegesListForRole(roleId: number): Observable<Privilege[]> {
    const url = `${this.api}/${roleId}`;
    return this.http.get<Privilege[]>(url);
  }

  getFullList(): Observable<Privilege[]> {
    return this.http.get<Privilege[]>(this.api);
  }

  isPrivileged(user, privilege): boolean {
    if(user && user.Roles && user.Roles.length > 0) {
      let privileges = [];
      for (const role of user.Roles) {
        privileges.push(role.Privileges.map(privilege => {
          return privilege.keyString;
        }));
      }
      privileges = [].concat(...privileges);
      privileges = privileges.filter((v, i, a) => a.indexOf(v) === i);
      return privileges.includes(privilege);
    } else {
      return false;
    }
  }

}
