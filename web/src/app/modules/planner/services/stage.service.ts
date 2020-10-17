import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stage } from '../models';

import { CollectionServiceMessage, ItemServiceMessage } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable()
export class StageService {
  constructor(private http: HttpClient) {}

  create(stage: Stage): Observable<ItemServiceMessage<Stage>> {
    return this.http.post<ItemServiceMessage<Stage>>(APIS.STAGES, stage);
  }

  getList(): Observable<CollectionServiceMessage<Stage>> {
    return this.http.get<CollectionServiceMessage<Stage>>(APIS.STAGES);
  }
}
