import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan, Stage, PlanServerResponse } from '../models';
import { User } from '@/modules/users';
import { map } from 'rxjs/operators';

@Injectable()
export class PlanService {
  private api: string;

  constructor(private http: HttpClient) {
    this.api = '/plans';
  }

  create(plan: Plan) {
    return this.http.post<any>(this.api, this.formatBeforeSend(plan));
  }

  getList(pageIndex = 0, pageSize = 5, sortIndex = 'id', sortDirection = 'asc'): Observable<PlanServerResponse> {
    return this.http.get<PlanServerResponse>(this.api, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  getListByStage(stage: number, pageIndex = 0, pageSize = 5): Observable<Plan[]> {
    const url = `${this.api}/stageList/${stage}`;
    return this.http.get<Plan[]>(url, {
      params: new HttpParams().set('pageIndex', pageIndex.toString()).set('pageSize', pageSize.toString())
    });
  }

  getOne(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.api}/${id}`);
  }

  updateOne(plan: Plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.api}/${plan.id}`, this.formatBeforeSend(plan));
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  updatePlanStages(plan: Plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.api}/updatePlanStages`, this.formatBeforeSend(plan));
  }

  toNextStage(id: number): Observable<Plan> {
    const url = `${this.api}/toNextStage/${id}`;
    return this.http.get<Plan>(url);
  }

  deleteDoc(req: any) {
    return this.http.delete<any | Plan>(`${this.api}/documents`, {
      params: new HttpParams().set('docId', req.docId.toString()).set('planId', req.planId.toString())
    });
  }

  formatBeforeSend(plan: Plan): Plan {
    let formated = { ...plan };
    if (formated.Creator) {
      const creator = {
        id: formated.Creator.id
      } as User;
      formated = Object.assign({}, formated, { Creator: creator });
    }
    if (formated.Participants && formated.Participants.length) {
      formated = Object.assign({}, formated, {
        Participants: formated.Participants.map(participant => {
          return <User>{
            id: participant.id
          };
        })
      });
    }
    return formated;
  }
}
