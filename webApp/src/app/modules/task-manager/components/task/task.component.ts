import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Task } from '../../models';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import { deleteTask, updateTask, createTask } from '../../store/task.actions';
import { Update } from '@ngrx/entity';
import { TaskService } from '../../services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MediaqueryService } from '@/shared';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnDestroy {
  @Input() tasks: Task[];

  task: Task;
  taskInitial: Task;
  title: string;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store: Store<AppState>,
    private taskService: TaskService,
    public dialog: MatDialog,
    private mediaQuery: MediaqueryService
  ) {}

  // TODO: event type
  changeTaskStatus(event: any, task: Task): void {
    this.task = { ...task, isCompleted: event.checked };

    this.taskService
      .updateOne(this.task)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.task = cloneDeep(data);
        const task: Update<Task> = {
          id: this.task.id,
          changes: data
        };

        this.store.dispatch(updateTask({ task }));
      });
  }

  openTaskDialog(task?: Task): void {
    let title: string;
    task ? (title = 'Update task') : ((title = 'Add new task'), (task = this.task));
    console.log(this.task);

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      ...this.mediaQuery.smallPopupSize,
      data: {
        title,
        task
      }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(result => {
        if (result) {
          if ('id' in result) {
            this.taskService
              .updateOne(result)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(
                data => {
                  this.task = cloneDeep(data);
                  this.taskInitial = cloneDeep(data);
                  const task: Update<Task> = {
                    id: this.task.id,
                    changes: data
                  };

                  this.store.dispatch(updateTask({ task }));

                  Swal.fire({
                    text: 'Task updated!',
                    icon: 'success',
                    timer: 2500,
                    toast: true,
                    showConfirmButton: false,
                    position: 'bottom-end'
                  });
                },
                error => {
                  Swal.fire({
                    text: 'Ooops, something went wrong!',
                    icon: 'error',
                    timer: 2500,
                    toast: true,
                    showConfirmButton: false,
                    position: 'bottom-end'
                  });
                }
              );
          } else {
            this.task = { ...result };
            this.store.dispatch(createTask({ task: { ...this.task } }));
          }
        }
      });
  }

  deleteTask(id: number): void {
    this.store.dispatch(deleteTask({ id }));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
