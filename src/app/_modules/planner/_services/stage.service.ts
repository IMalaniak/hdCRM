import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Stage } from '../_models';

@Injectable()
export class StageService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/stages';
  }

  createStage(stage: Stage): Observable<Stage> {
    return this.http.post<Stage>(this.api, stage);
  }

  getStagesList(): Observable<Stage[]> {
    return this.http.get<Stage[]>(this.api);
  }

  countPlansByStage(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.api}/countPlans`);
  }
}
