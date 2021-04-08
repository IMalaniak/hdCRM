import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_ROUTES } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';

@Injectable()
export class PrivilegeService extends BaseCrudService {
  protected url = API_ROUTES.PRIVILEGES;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }
}
