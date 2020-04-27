import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { Task } from '../../models';
import { selectAllTasks } from '../../store/task.selectors';

@Component({
  selector: 'task-manager',
  templateUrl: './task-manager.component.html'
})
export class TaskManagerComponent implements OnInit {
  tasks$: Observable<Task[]>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.tasks$ = this.store.pipe(select(selectAllTasks));
  }
}
