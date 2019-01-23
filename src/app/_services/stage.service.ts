import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stage } from '@/_models';

@Injectable()
export class StageService {
  constructor(
    private http: HttpClient
  ) { }

  getStagesList() {
    return this.http.get<any | Stage[]>(`${environment.baseUrl}/stages/list`);
  }

}
