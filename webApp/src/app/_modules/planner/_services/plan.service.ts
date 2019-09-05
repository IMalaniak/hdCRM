import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan, Stage, PlanServerResponse } from '../_models';
import { User } from '@/_modules/users';
import { map } from 'rxjs/operators';

@Injectable()
export class PlanService {
  private api: string;

  constructor(
    private http: HttpClient
  ) {
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
      }).pipe(
        map(res => new PlanServerResponse(res))
      );
  }

  getListByStage(stage: number, pageIndex = 0, pageSize = 5): Observable<Plan[]> {
    const url = `${this.api}/stageList/${stage}`;
    return this.http.get<Plan[]>(url, {
        params: new HttpParams()
            .set('pageIndex', pageIndex.toString())
            .set('pageSize', pageSize.toString())
        });
  }

  getOne(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.api}/${id}`).pipe(
      map(res => new Plan(res))
    );
  }

  updateOne(plan: Plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.api}/${plan.id}`, this.formatBeforeSend(plan));
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
      params: new HttpParams()
          .set('docId', req.docId.toString())
          .set('planId', req.planId.toString())
      });
  }

  formatBeforeSend(plan: Plan): Plan {
    if (plan.Creator) {
      const creator = new User({
        id: plan.Creator.id
      });
      plan.Creator = creator;
    }
    if (plan.Participants && plan.Participants.length > 0) {
      plan.Participants = plan.Participants.map(participant => {
        return new User({
          id: participant.id
        });
      });
    }
    return plan;
  }

}
