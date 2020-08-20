import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Privilege } from '../models';
import { CollectionApiResponse, ItemApiResponse } from '@/shared/models';

@Injectable()
export class PrivilegeService {
  private api = '/privileges';

  constructor(private http: HttpClient) {}

  create(privilege: Privilege): Observable<ItemApiResponse<Privilege>> {
    return this.http.post<ItemApiResponse<Privilege>>(this.api, privilege);
  }

  getFullList(): Observable<CollectionApiResponse<Privilege>> {
    return this.http.get<CollectionApiResponse<Privilege>>(this.api);
  }
}
