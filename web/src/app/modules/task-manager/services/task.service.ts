import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseMessage } from '@/shared/models';
import { API_ROUTES } from '@/shared/constants';
import { BaseCrudService } from '@/shared/services';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseCrudService {
  protected readonly url = API_ROUTES.TASKS;

  constructor(protected readonly http: HttpClient) {
    super(http);
  }

  deleteMultipleTask(taskIds: number[]): Observable<BaseMessage> {
    // TODO @ArseniiIrod, @IMalaniak change this to delete request with body
    return this.http.put<any>(`${API_ROUTES.TASKS_MULTIPLE}/${1}`, { taskIds });
  }
}
