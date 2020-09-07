import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models';
import { CollectionApiResponse } from '@/shared';

@Injectable()
export class StateService {
  private api = '/states';

  constructor(private http: HttpClient) {}

  getList(): Observable<CollectionApiResponse<State>> {
    return this.http.get<CollectionApiResponse<State>>(this.api);
  }
}
