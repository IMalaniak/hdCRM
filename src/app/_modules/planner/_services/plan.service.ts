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
    return this.http.post<any>(this.api, plan);
  }

  getFullList(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.api);
  }

  getListByStage(stage: number): Observable<Plan[]> {
    const url = `${this.api}/stageList/${stage}`;
    return this.http.get<Plan[]>(url);
  }

  getPlan(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.api}/${id}`);
  }

  updatePlan(plan): Observable<Plan> {
    return this.http.put<Plan>(this.api, plan);
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
