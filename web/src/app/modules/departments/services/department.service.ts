import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Department } from '../models';
import { User } from '@/modules/users/models';
import { APIS } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services/base-http-crud.service';
import { CollectionApiResponse } from '@/shared/models';

@Injectable()
export class DepartmentService extends BaseCrudService {
  protected readonly url = APIS.DEPARTMENTS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  getDashboardData(): Observable<CollectionApiResponse<Department>> {
    return this.http.get<CollectionApiResponse<Department>>(APIS.DEPARTMENTS_DASHBOARD);
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
