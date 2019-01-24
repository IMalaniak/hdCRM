import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '@/_models';

@Injectable()
export class StateService {
  constructor(
    private http: HttpClient
  ) { }

  getStatesList(): Observable<State[]> {
    return this.http.get<State[]>(`${environment.baseUrl}/states/listFull`);
  }

}
