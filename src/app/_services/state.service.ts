import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State } from '@/_models';

@Injectable()
export class StateService {
  constructor(
    private http: HttpClient
  ) { }

  getStatesList() {
    return this.http.get<any | State[]>(`${environment.baseUrl}/states/listFull`);
  }

}
