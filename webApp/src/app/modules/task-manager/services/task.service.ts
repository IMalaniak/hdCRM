import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskPriority } from '../models';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/shared/models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksApi = '/tasks';
  private prioritiesApi = '/task-priorities';

  constructor(private http: HttpClient) {}

  create(task: Task) {
    return this.http.post<any>(this.tasksApi, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.tasksApi}/${task.id}`, task);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.tasksApi}/${id}`);
  }

  deleteMultipleTask(taskIds: number[]): Observable<ApiResponse> {
    // TODO @ArseniiIrod, @IMalaniak change this to delete request with body
    return this.http.put<any>(`${this.tasksApi}/task-multiple/${1}`, { taskIds });
  }

  getList(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksApi);
  }

  getPriorities(): Observable<TaskPriority[]> {
    return this.http.get<TaskPriority[]>(this.prioritiesApi);
  }
}
