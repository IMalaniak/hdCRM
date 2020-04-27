import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private api: string;

  constructor(private http: HttpClient) {
    this.api = '/tasks';
  }

  create(task: Task) {
    return this.http.post<any>(this.api, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${task.id}`, task);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  getList(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }
}
