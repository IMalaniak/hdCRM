import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, DepartmentServerResponse } from '../models';
import { User } from '@/modules/users/models';

@Injectable()
export class DepartmentService {
  private api = '/departments';

  constructor(private http: HttpClient) {}

  create(department: Department) {
    return this.http.post<any>(this.api, this.formatBeforeSend(department));
  }

  getOne(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.api}/${id}`);
  }

  updateOne(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.api}/${department.id}`, this.formatBeforeSend(department));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  getList(pageIndex = 0, pageSize = 5, sortIndex = 'id', sortDirection = 'asc'): Observable<DepartmentServerResponse> {
    return this.http.get<DepartmentServerResponse>(this.api, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  getDashboardData(): Observable<DepartmentServerResponse> {
    return this.http.get<DepartmentServerResponse>(`${this.api}/dashboard`);
  }

  formatBeforeSend(dep: Department): Department {
    let formated = { ...dep };
    if (formated.Workers && formated.Workers.length) {
      formated = Object.assign({}, formated, {
        Participants: formated.Workers.map(worker => {
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
