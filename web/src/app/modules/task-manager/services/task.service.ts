import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskPriority } from '../models';
import { Observable } from 'rxjs';
import { ServiceMessage, CollectionServiceMessage, ItemServiceMessage } from '@/shared/models';
import { APIS } from '@/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) {}

  create(task: Task): Observable<ItemServiceMessage<Task>> {
    return this.http.post<ItemServiceMessage<Task>>(APIS.TASKS, task);
  }

  updateTask(task: Task): Observable<ItemServiceMessage<Task>> {
    return this.http.put<ItemServiceMessage<Task>>(`${APIS.TASKS}/${task.id}`, task);
  }

  delete(id: number): Observable<ServiceMessage> {
    return this.http.delete<ServiceMessage>(`${APIS.TASKS}/${id}`);
  }

  deleteMultipleTask(taskIds: number[]): Observable<ServiceMessage> {
    // TODO @ArseniiIrod, @IMalaniak change this to delete request with body
    return this.http.put<any>(`${APIS.TASKS_MULTIPLE}/${1}`, { taskIds });
  }

  getList(): Observable<CollectionServiceMessage<Task>> {
    return this.http.get<CollectionServiceMessage<Task>>(APIS.TASKS);
  }

  getPriorities(): Observable<CollectionServiceMessage<TaskPriority>> {
    return this.http.get<CollectionServiceMessage<TaskPriority>>(APIS.TASKS_PRIORITIES);
  }
}
