// tslint:disable:max-line-length
import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plan } from '@/_models';

@Injectable()
export class PlanService {
  constructor(
    private http: HttpClient
  ) { }

  createPlan(plan: Plan) {
    return this.http.post<any>(`${environment.baseUrl}/plans/create`, plan);
  }

  getFullList() {
    return this.http.get<any | Plan[]>(`${environment.baseUrl}/plans/fullList`);
  }

  getListByStage(stage: number) {
    const url = `${environment.baseUrl}/plans/stageList/${stage}`;
    return this.http.get<any | Plan[]>(url);
  }

  getPlan(id: number) {
    const url = `${environment.baseUrl}/plans/details/${id}`;
    return this.http.get<any | Plan>(url);
  }

  updatePlan(plan) {
    return this.http.put<any | Plan>(`${environment.baseUrl}/plans/update`, plan);
  }

  // redo
  deleteDoc(req: any) {
    return this.http.put<any | Plan>(`${environment.baseUrl}/plans/delete-doc`, req);
  }

}
