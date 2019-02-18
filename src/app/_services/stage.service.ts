import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Stage } from '@/_models';

@Injectable()
export class StageService {
  constructor(
    private http: HttpClient
  ) { }

  createStage(stage: Stage): Observable<Stage> {
    return this.http.post<Stage>(`${environment.baseUrl}/stages/create`, stage);
  }

  getStagesList(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${environment.baseUrl}/stages/list`);
  }

}
