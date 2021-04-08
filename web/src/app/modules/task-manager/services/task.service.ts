import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseMessage } from '@/shared/models';
import { ApiRoutesConstants } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseCrudService {
  protected readonly url = ApiRoutesConstants.TASKS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  deleteMultipleTask(taskIds: number[]): Observable<BaseMessage> {
    // TODO @ArseniiIrod, @IMalaniak change this to delete request with body
    return this.http.put<any>(`${ApiRoutesConstants.TASKS_MULTIPLE}/${1}`, { taskIds });
  }
}
