import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../_models';

@Injectable()
export class DepartmentService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/departments';
  }

  createDepartment(department: Department) {
    return this.http.post<any>(this.api, department);
  }

  getDepartment(id: number): Observable<Department> {
    const url = `${this.api}/${id}`;
    return this.http.get<Department>(url);
  }

  updateDepartment(department): Observable<Department> {
    return this.http.put<Department>(this.api, department);
  }

  getDepartmentList(): Observable<Department[]> {
    return this.http.get<Department[]>(this.api);
  }

}
