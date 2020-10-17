import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { Observable } from 'rxjs';
import { Task } from '../../models';
import { selectAllTasks } from '../../store/task.selectors';

@Component({
  selector: 'task-manager',
  templateUrl: './task-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskManagerComponent {
  tasks$: Observable<Task[]> = this.store.pipe(select(selectAllTasks));

  constructor(private store: Store<AppState>) {}
}
