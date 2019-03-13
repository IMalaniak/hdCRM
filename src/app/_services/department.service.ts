import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '@/_models';

@Injectable()
export class DepartmentService {
  constructor(
    private http: HttpClient
    ) { }

  createDepartment(department: Department) {
    return this.http.post<any>(`${environment.baseUrl}/departments/create`, department);
  }

  getDepartment(id: number): Observable<Department> {
    const url = `${environment.baseUrl}/departments/details/${id}`;
    return this.http.get<Department>(url);
  }

  updateDepartment(department): Observable<Department> {
    return this.http.put<Department>(`${environment.baseUrl}/departments/update`, department);
  }

  getDepartmentList(): Observable<Department[]> {
    return this.http.get<Department[]>(`${environment.baseUrl}/departments/list`);
  }

}
