import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Department } from '../models';
import { User } from '@/modules/users/models';
import { APIS } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services/base-http-crud.service';

@Injectable()
export class DepartmentService extends BaseCrudService {
  protected url = APIS.DEPARTMENTS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  formatBeforeSend(dep: Department): Department {
    let formated = { ...dep };
    if (formated.Workers && formated.Workers.length) {
      formated = Object.assign({}, formated, {
        Workers: formated.Workers.map((worker) => {
          return <User>{
            id: worker.id
          };
        })
      });
    }

    if (formated.Manager && formated.Manager.id) {
      const manager = { id: formated.Manager.id } as User;
      formated = Object.assign({}, formated, { Manager: manager });
    }
    return formated;
  }
}
