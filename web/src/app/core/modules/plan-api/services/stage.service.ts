import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiRoutesConstants } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';

@Injectable()
export class StageService extends BaseCrudService {
  protected readonly url = ApiRoutesConstants.STAGES;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }
}
