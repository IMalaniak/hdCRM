import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan, Stage } from '../_models';

@Injectable()
export class PlanService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
    this.api = '/plans';
  }

  createPlan(plan: Plan) {
    return this.http.post<any>(`${this.api}/create`, plan);
  }

  getFullList(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.api}/fullList`);
  }

  getListByStage(stage: number): Observable<Plan[]> {
    const url = `${this.api}/stageList/${stage}`;
    return this.http.get<Plan[]>(url);
  }

  getPlan(id: number): Observable<Plan> {
    const url = `${this.api}/details/${id}`;
    return this.http.get<Plan>(url);
  }

  updatePlan(plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.api}/update`, plan);
  }

  updatePlanStages(plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.api}/updatePlanStages`, plan);
  }

  toNextStage(id: number): Observable<Plan> {
    const url = `${this.api}/toNextStage/${id}`;
    return this.http.get<Plan>(url);
  }

  // redo
  deleteDoc(req: any) {
    return this.http.put<any | Plan>(`${this.api}/delete-doc`, req);
  }

}
