import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { APIS } from '@/shared/constants';
import { BaseHttpCrudService } from '@/shared/services';

@Injectable()
export class PrivilegeService extends BaseHttpCrudService {
  protected url = APIS.PRIVILEGES;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }
}
