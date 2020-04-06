import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, DepartmentServerResponse } from '../models';
import { User } from '@/modules/users/models';

@Injectable()
export class DepartmentService {
  private api: string;

  constructor(private http: HttpClient) {
    this.api = '/departments';
  }

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
    if (dep.Workers && dep.Workers.length > 0) {
      dep.Workers = dep.Workers.map(user => {
        return <User>{
          id: user.id
        };
      });
    }

    if (dep.Manager && dep.Manager.id) {
      const manager = new User();
      manager.id = dep.Manager.id;
      dep.Manager = manager;
    }
    return dep;
  }
}
