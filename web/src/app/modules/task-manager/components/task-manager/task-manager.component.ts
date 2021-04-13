import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '@/core/store';

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
