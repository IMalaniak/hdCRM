import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Privilege } from '../models';
import { CollectionApiResponse, ItemApiResponse } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable()
export class PrivilegeService {
  constructor(private http: HttpClient) {}

  create(privilege: Privilege): Observable<ItemApiResponse<Privilege>> {
    return this.http.post<ItemApiResponse<Privilege>>(APIS.PRIVILEGES, privilege);
  }

  getFullList(): Observable<CollectionApiResponse<Privilege>> {
    return this.http.get<CollectionApiResponse<Privilege>>(APIS.PRIVILEGES);
  }
}
