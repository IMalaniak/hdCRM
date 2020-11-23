import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseMessage, PageQuery, CollectionApiResponse, ItemApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseCrudService {
  protected abstract url: string;

  constructor(protected readonly http: HttpClient) {}

  getOne<T>(id: number): Observable<ItemApiResponse<T>> {
    return this.http.get<ItemApiResponse<T>>(`${this.url}/${id}`);
  }

  getList<T>(pageQuery?: PageQuery, url?: string): Observable<CollectionApiResponse<T>> {
    if (pageQuery) {
      return this.http.get<CollectionApiResponse<T>>(this.url, {
        params: new HttpParams()
          .set('pageIndex', pageQuery.pageIndex.toString())
          .set('pageSize', pageQuery.pageSize.toString())
          .set('sortIndex', pageQuery.sortIndex)
          .set('sortDirection', pageQuery.sortDirection)
      });
    }
    return this.http.get<CollectionApiResponse<T>>(this.getCustomUrl(url));
  }

  create<T>(data: T): Observable<ItemApiResponse<T>> {
    return this.http.post<ItemApiResponse<T>>(this.url, data);
  }

  update<T>(data: T, id?: number, url?: string): Observable<ItemApiResponse<T>> {
    return this.http.put<ItemApiResponse<T>>(this.getCustomUrl(url, id), data);
  }

  delete(id: number): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(`${this.url}/${id}`);
  }

  private getCustomUrl(customUrl: string, id?: number): string {
    let url: string = customUrl || this.url;
    if (customUrl && id) {
      url += `/${id}`;
    }

    return url;
  }
}
