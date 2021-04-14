import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@core/modules/user-api/shared';
import { ApiRoutesConstants } from '@shared/constants';
import { CollectionApiResponse } from '@shared/models';
import { BaseCrudService } from '@shared/services';

import { Role } from '../shared/models';

@Injectable()
export class RoleService extends BaseCrudService {
  protected readonly url = ApiRoutesConstants.ROLES;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  getDashboardData(): Observable<CollectionApiResponse<Role>> {
    return this.http.get<CollectionApiResponse<Role>>(ApiRoutesConstants.ROLES_DASHBOARD);
  }

  formatBeforeSend(role: Role): Role {
    let formated = { ...role };
    if (role.Users && role.Users.length) {
      formated = Object.assign({}, formated, {
        Users: formated.Users.map(
          (user) =>
            ({
              id: user.id
            } as User)
        )
      });
    }
    return formated;
  }
}
