import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseMessage } from '@/shared/models';
import { APIS } from '@/shared/constants';
import { BaseHttpCrudService } from '@/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseHttpCrudService {
  protected url = APIS.TASKS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  deleteMultipleTask(taskIds: number[]): Observable<BaseMessage> {
    // TODO @ArseniiIrod, @IMalaniak change this to delete request with body
    return this.http.put<any>(`${APIS.TASKS_MULTIPLE}/${1}`, { taskIds });
  }
}
