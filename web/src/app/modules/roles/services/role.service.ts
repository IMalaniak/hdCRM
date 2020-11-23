import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Role } from '../models';
import { User } from '@/modules/users/models';
import { APIS } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';

@Injectable()
export class RoleService extends BaseCrudService {
  protected url = APIS.ROLES;

  constructor(protected readonly http: HttpClient) {
    super(http);
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
