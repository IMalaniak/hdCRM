import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '@/core/modules/user-api/shared';
import { API_ROUTES } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';
import { CollectionApiResponse } from '@/shared/models';
import { Department } from '../shared/models';

@Injectable()
export class DepartmentService extends BaseCrudService {
  protected readonly url = API_ROUTES.DEPARTMENTS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  getDashboardData(): Observable<CollectionApiResponse<Department>> {
    return this.http.get<CollectionApiResponse<Department>>(API_ROUTES.DEPARTMENTS_DASHBOARD);
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
