import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskPriority } from '../models';
import { Observable } from 'rxjs';
import { BaseMessage, CollectionApiResponse, ItemApiResponse } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) {}

  create(task: Task): Observable<ItemApiResponse<Task>> {
    return this.http.post<ItemApiResponse<Task>>(APIS.TASKS, task);
  }

  updateTask(task: Task): Observable<ItemApiResponse<Task>> {
    return this.http.put<ItemApiResponse<Task>>(`${APIS.TASKS}/${task.id}`, task);
  }

  delete(id: number): Observable<BaseMessage> {
    return this.http.delete<BaseMessage>(`${APIS.TASKS}/${id}`);
  }

  deleteMultipleTask(taskIds: number[]): Observable<BaseMessage> {
    // TODO @ArseniiIrod, @IMalaniak change this to delete request with body
    return this.http.put<any>(`${APIS.TASKS_MULTIPLE}/${1}`, { taskIds });
  }

  getList(): Observable<CollectionApiResponse<Task>> {
    return this.http.get<CollectionApiResponse<Task>>(APIS.TASKS);
  }

  getPriorities(): Observable<CollectionApiResponse<TaskPriority>> {
    return this.http.get<CollectionApiResponse<TaskPriority>>(APIS.TASKS_PRIORITIES);
  }
}
