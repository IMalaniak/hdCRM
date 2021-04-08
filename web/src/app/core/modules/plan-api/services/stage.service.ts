import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiRoutesConstants } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';
import { CollectionApiResponse } from '@/shared/models';
import { Stage } from '../shared';

@Injectable()
export class StageService extends BaseCrudService {
  protected readonly url = ApiRoutesConstants.STAGES;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  getDashboardData(): Observable<CollectionApiResponse<Stage>> {
    return this.http.get<CollectionApiResponse<Stage>>(ApiRoutesConstants.STAGES_DASHBOARD);
  }
}
