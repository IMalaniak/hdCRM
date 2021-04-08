import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesConstants } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';

@Injectable()
export class PrivilegeService extends BaseCrudService {
  protected url = ApiRoutesConstants.PRIVILEGES;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }
}
