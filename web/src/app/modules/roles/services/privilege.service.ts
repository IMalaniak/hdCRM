import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Privilege } from '../models';
import { CollectionServiceMessage, ItemServiceMessage } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable()
export class PrivilegeService {
  constructor(private http: HttpClient) {}

  create(privilege: Privilege): Observable<ItemServiceMessage<Privilege>> {
    return this.http.post<ItemServiceMessage<Privilege>>(APIS.PRIVILEGES, privilege);
  }

  getFullList(): Observable<CollectionServiceMessage<Privilege>> {
    return this.http.get<CollectionServiceMessage<Privilege>>(APIS.PRIVILEGES);
  }
}
