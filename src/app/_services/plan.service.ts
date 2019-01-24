// tslint:disable:max-line-length
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '@/_models';

@Injectable()
export class PlanService {
  constructor(
    private http: HttpClient
  ) { }

  createPlan(plan: Plan) {
    return this.http.post<any>(`${environment.baseUrl}/plans/create`, plan);
  }

  getFullList(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${environment.baseUrl}/plans/fullList`);
  }

  getListByStage(stage: number): Observable<Plan[]> {
    const url = `${environment.baseUrl}/plans/stageList/${stage}`;
    return this.http.get<Plan[]>(url);
  }

  getPlan(id: number): Observable<Plan> {
    const url = `${environment.baseUrl}/plans/details/${id}`;
    return this.http.get<Plan>(url);
  }

  updatePlan(plan): Observable<Plan> {
    return this.http.put<Plan>(`${environment.baseUrl}/plans/update`, plan);
  }

  // redo
  deleteDoc(req: any) {
    return this.http.put<any | Plan>(`${environment.baseUrl}/plans/delete-doc`, req);
  }

}
