import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../_models';

@Injectable()
export class StateService {
  private api: string;
  constructor(private http: HttpClient) {
    this.api = '/states';
  }

  getList(): Observable<State[]> {
    return this.http.get<State[]>(this.api);
  }
}
