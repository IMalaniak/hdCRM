import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskPriority } from '../models';
import { Observable } from 'rxjs';
import { ApiResponse, CollectionApiResponse, ItemApiResponse } from '@/shared/models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksApi = '/tasks';
  private prioritiesApi = '/task-priorities';

  constructor(private http: HttpClient) {}

  create(task: Task): Observable<ItemApiResponse<Task>> {
    return this.http.post<ItemApiResponse<Task>>(this.tasksApi, task);
  }

  updateTask(task: Task): Observable<ItemApiResponse<Task>> {
    return this.http.put<ItemApiResponse<Task>>(`${this.tasksApi}/${task.id}`, task);
  }

  delete(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.tasksApi}/${id}`);
  }

  deleteMultipleTask(taskIds: number[]): Observable<ApiResponse> {
    // TODO @ArseniiIrod, @IMalaniak change this to delete request with body
    return this.http.put<any>(`${this.tasksApi}/task-multiple/${1}`, { taskIds });
  }

  getList(): Observable<CollectionApiResponse<Task>> {
    return this.http.get<CollectionApiResponse<Task>>(this.tasksApi);
  }

  getPriorities(): Observable<CollectionApiResponse<TaskPriority>> {
    return this.http.get<CollectionApiResponse<TaskPriority>>(this.prioritiesApi);
  }
}
