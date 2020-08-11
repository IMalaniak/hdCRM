import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models';

@Injectable()
export class StateService {
  private api = '/states';

  constructor(private http: HttpClient) {}

  getList(): Observable<State[]> {
    return this.http.get<State[]>(this.api);
  }
}
