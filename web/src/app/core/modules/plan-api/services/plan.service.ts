import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '@/core/modules/user-api/shared';
import { BaseMessage } from '@/shared/models';
import { ApiRoutesConstants } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';
import { Plan } from '../shared/models';

@Injectable()
export class PlanService extends BaseCrudService {
  protected readonly url = ApiRoutesConstants.PLANS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  // updatePlanStages(plan: Plan): Observable<ItemServiceMessage<Plan>> {
  //   return this.http.put<ItemServiceMessage<Plan>>(`${this.api}/updatePlanStages`, this.formatBeforeSend(plan));
  // }

  // toNextStage(id: number): Observable<ItemServiceMessage<Plan>> {
  //   const url = `${this.api}/toNextStage/${id}`;
  //   return this.http.get<ItemServiceMessage<Plan>>(url);
  // }

  deleteDoc(req: any): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(ApiRoutesConstants.PLANS_DOCUMENTS, {
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
        Participants: formated.Participants.map(
          (participant) =>
            ({
              id: participant.id
            } as User)
        )
      });
    }
    return formated;
  }
}
