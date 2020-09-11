import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../models';
import { CollectionApiResponse } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable()
export class StateService {
  constructor(private http: HttpClient) {}

  getList(): Observable<CollectionApiResponse<State>> {
    return this.http.get<CollectionApiResponse<State>>(APIS.STATES);
  }
}
