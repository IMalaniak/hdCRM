import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stage } from '../models';

import { CollectionApiResponse, ItemApiResponse } from '@/shared/models';

@Injectable()
export class StageService {
  private api = '/stages';

  constructor(private http: HttpClient) {}

  create(stage: Stage): Observable<ItemApiResponse<Stage>> {
    return this.http.post<ItemApiResponse<Stage>>(this.api, stage);
  }

  getList(): Observable<CollectionApiResponse<Stage>> {
    return this.http.get<CollectionApiResponse<Stage>>(this.api);
  }
}
