import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@core/modules/user-api/shared';
import { ApiRoutesConstants } from '@shared/constants';
import { CollectionApiResponse } from '@shared/models';
import { BaseCrudService } from '@shared/services';

import { Department } from '../shared/models';

@Injectable()
export class DepartmentService extends BaseCrudService {
  protected readonly url = ApiRoutesConstants.DEPARTMENTS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  getDashboardData(): Observable<CollectionApiResponse<Department>> {
    return this.http.get<CollectionApiResponse<Department>>(ApiRoutesConstants.DEPARTMENTS_DASHBOARD);
  }

  formatBeforeSend(dep: Department): Department {
    let formated = { ...dep };
    if (formated.Workers && formated.Workers.length) {
      formated = Object.assign({}, formated, {
        Workers: formated.Workers.map(
          (worker) =>
            ({
              id: worker.id
            } as User)
        )
      });
    }

    if (formated.Manager && formated.Manager.id) {
      const manager = { id: formated.Manager.id } as User;
      formated = Object.assign({}, formated, { Manager: manager });
    }
    return formated;
  }
}
