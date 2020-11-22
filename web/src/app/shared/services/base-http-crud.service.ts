import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseMessage, PageQuery, CollectionApiResponse, ItemApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseHttpCrudService {
  protected abstract url: string;

  constructor(protected readonly http: HttpClient) {}

  get<T>(id: number): Observable<ItemApiResponse<T>> {
    return this.http.get<ItemApiResponse<T>>(`${this.url}/${id}`);
  }

  getItems<T>({ pageIndex, pageSize, sortIndex, sortDirection }: PageQuery): Observable<CollectionApiResponse<T>> {
    return this.http.get<CollectionApiResponse<T>>(this.url, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  create<T>(data: T): Observable<ItemApiResponse<T>> {
    return this.http.post<ItemApiResponse<T>>(this.url, data);
  }

  update<T>(data: T, id: number): Observable<ItemApiResponse<T>> {
    return this.http.put<ItemApiResponse<T>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(`${this.url}/${id}`);
  }
}
