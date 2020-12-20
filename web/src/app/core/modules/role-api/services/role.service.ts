import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '@/core/modules/user-api/shared';
import { APIS } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';
import { CollectionApiResponse } from '@/shared/models';
import { Role } from '../shared/models';

@Injectable()
export class RoleService extends BaseCrudService {
  protected readonly url = APIS.ROLES;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  getDashboardData(): Observable<CollectionApiResponse<Role>> {
    return this.http.get<CollectionApiResponse<Role>>(APIS.ROLES_DASHBOARD);
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
