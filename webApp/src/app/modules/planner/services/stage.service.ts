import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Stage, StageServerResponse } from '../models';

@Injectable()
export class StageService {
  private api = '/stages';

  constructor(private http: HttpClient) {}

  create(stage: Stage): Observable<Stage> {
    return this.http.post<Stage>(this.api, stage);
  }

  getList(): Observable<StageServerResponse> {
    return this.http.get<StageServerResponse>(this.api);
  }

  countPlansByStage(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.api}/countPlans`);
  }
}
