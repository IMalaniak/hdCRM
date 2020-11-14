import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Plan } from '../models';
import { User } from '@/modules/users';
import { CollectionApiResponse, BaseMessage, ItemApiResponse, PageQuery } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable()
export class PlanService {
  constructor(private http: HttpClient) {}

  create(plan: Plan): Observable<ItemApiResponse<Plan>> {
    return this.http.post<ItemApiResponse<Plan>>(APIS.PLANS, this.formatBeforeSend(plan));
  }

  getList({ pageIndex, pageSize, sortIndex, sortDirection }: PageQuery): Observable<CollectionApiResponse<Plan>> {
    return this.http.get<CollectionApiResponse<Plan>>(APIS.PLANS, {
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
        .set('sortIndex', sortIndex)
        .set('sortDirection', sortDirection)
    });
  }

  getOne(id: number): Observable<ItemApiResponse<Plan>> {
    return this.http.get<ItemApiResponse<Plan>>(`${APIS.PLANS}/${id}`);
  }

  updateOne(plan: Plan): Observable<ItemApiResponse<Plan>> {
    return this.http.put<ItemApiResponse<Plan>>(`${APIS.PLANS}/${plan.id}`, this.formatBeforeSend(plan));
  }

  delete(id: number): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(`${APIS.PLANS}/${id}`);
  }

  // updatePlanStages(plan: Plan): Observable<ItemServiceMessage<Plan>> {
  //   return this.http.put<ItemServiceMessage<Plan>>(`${this.api}/updatePlanStages`, this.formatBeforeSend(plan));
  // }

  // toNextStage(id: number): Observable<ItemServiceMessage<Plan>> {
  //   const url = `${this.api}/toNextStage/${id}`;
  //   return this.http.get<ItemServiceMessage<Plan>>(url);
  // }

  deleteDoc(req: any): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(APIS.PLANS_DOCUMENTS, {
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
        Participants: formated.Participants.map((participant) => {
          return <User>{
            id: participant.id
          };
        })
      });
    }
    return formated;
  }
}
