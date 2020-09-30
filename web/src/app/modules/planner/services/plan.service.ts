import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models';
import { User } from '@/modules/users';
import { CollectionApiResponse, ApiResponse, ItemApiResponse } from '@/shared/models';
import { APIS, CONSTANTS } from '@/shared/constants';

@Injectable()
export class PlanService {
  constructor(private http: HttpClient) {}

  create(plan: Plan): Observable<ItemApiResponse<Plan>> {
    return this.http.post<ItemApiResponse<Plan>>(APIS.PLANS, this.formatBeforeSend(plan));
  }

  getList(
    pageIndex = 0,
    pageSize = 5,
    sortIndex = 'id',
    sortDirection = 'asc'
  ): Observable<CollectionApiResponse<Plan>> {
    return this.http.get<CollectionApiResponse<Plan>>(APIS.PLANS, {
      params: new HttpParams()
        .set(CONSTANTS.PAGE_INDEX, pageIndex.toString())
        .set(CONSTANTS.PAGE_SIZE, pageSize.toString())
        .set(CONSTANTS.SORT_INDEX, sortIndex)
        .set(CONSTANTS.SORT_DIRECTION, sortDirection)
    });
  }

  // getListByStage(stage: number, pageIndex = 0, pageSize = 5): Observable<Plan[]> {
  //   const url = `${this.api}/stageList/${stage}`;
  //   return this.http.get<Plan[]>(url, {
  //     params: new HttpParams().set('pageIndex', pageIndex.toString()).set('pageSize', pageSize.toString())
  //   });
  // }

  getOne(id: number): Observable<ItemApiResponse<Plan>> {
    return this.http.get<ItemApiResponse<Plan>>(`${APIS.PLANS}/${id}`);
  }

  updateOne(plan: Plan): Observable<ItemApiResponse<Plan>> {
    return this.http.put<ItemApiResponse<Plan>>(`${APIS.PLANS}/${plan.id}`, this.formatBeforeSend(plan));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${APIS.PLANS}/${id}`);
  }

  // updatePlanStages(plan: Plan): Observable<ItemApiResponse<Plan>> {
  //   return this.http.put<ItemApiResponse<Plan>>(`${this.api}/updatePlanStages`, this.formatBeforeSend(plan));
  // }

  // toNextStage(id: number): Observable<ItemApiResponse<Plan>> {
  //   const url = `${this.api}/toNextStage/${id}`;
  //   return this.http.get<ItemApiResponse<Plan>>(url);
  // }

  deleteDoc(req: any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(APIS.PLANS_DOCUMENTS, {
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
