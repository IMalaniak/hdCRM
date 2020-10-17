import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models';
import { User } from '@/modules/users/models';
import { CollectionServiceMessage, ServiceMessage, ItemServiceMessage } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable()
export class DepartmentService {
  constructor(private http: HttpClient) {}

  create(department: Department): Observable<ItemServiceMessage<Department>> {
    return this.http.post<ItemServiceMessage<Department>>(APIS.DEPARTMENTS, this.formatBeforeSend(department));
  }

  getOne(id: number): Observable<ItemServiceMessage<Department>> {
    return this.http.get<ItemServiceMessage<Department>>(`${APIS.DEPARTMENTS}/${id}`);
  }

  updateOne(department: Department): Observable<ItemServiceMessage<Department>> {
    return this.http.put<ItemServiceMessage<Department>>(
      `${APIS.DEPARTMENTS}/${department.id}`,
      this.formatBeforeSend(department)
    );
  }

  delete(id: number): Observable<ServiceMessage> {
    return this.http.delete<ServiceMessage>(`${APIS.DEPARTMENTS}/${id}`);
  }

  getList(
    pageIndex = 0,
    pageSize = 5,
    sortIndex = 'id',
    sortDirection = 'asc'
  ): Observable<CollectionServiceMessage<Department>> {
    return this.http.get<CollectionServiceMessage<Department>>(APIS.DEPARTMENTS, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  getDashboardData(): Observable<CollectionServiceMessage<Department>> {
    return this.http.get<CollectionServiceMessage<Department>>(APIS.DEPARTMENTS_DASHBOARD);
  }

  formatBeforeSend(dep: Department): Department {
    let formated = { ...dep };
    if (formated.Workers && formated.Workers.length) {
      formated = Object.assign({}, formated, {
        Workers: formated.Workers.map((worker) => {
          return <User>{
            id: worker.id
          };
        })
      });
    }

    if (formated.Manager && formated.Manager.id) {
      const manager = { id: formated.Manager.id } as User;
      formated = Object.assign({}, formated, { Manager: manager });
    }
    return formated;
  }
}
