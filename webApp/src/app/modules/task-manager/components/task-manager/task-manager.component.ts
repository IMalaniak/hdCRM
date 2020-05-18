import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { Task, TaskPriority } from '../../models';
import { selectAllTasks, selectAllPriorities } from '../../store/task.selectors';

@Component({
  selector: 'task-manager',
  templateUrl: './task-manager.component.html'
})
export class TaskManagerComponent implements OnInit {
  tasks$: Observable<Task[]>;
  priorities$: Observable<TaskPriority[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.tasks$ = this.store.pipe(select(selectAllTasks));
    this.priorities$ = this.store.pipe(select(selectAllPriorities));
  }
}
