import { Component, OnDestroy, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Task, TaskDialogData, TaskPriority } from '../../../models';
import { Store } from '@ngrx/store';
import { AppState } from '@/core/reducers';
import {
  deleteTask,
  createTask,
  taskListRequested,
  updateTaskRequested,
  taskPrioritiesRequested,
  deleteMultipleTaskRequested
} from '../../../store/task.actions';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MediaqueryService, ToastMessageService } from '@/shared/services';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { OrganismsTaskDialogComponent } from '../organisms-task-dialog/organisms-task-dialog.component';
import { MatAccordion } from '@angular/material/expansion';
import { DIALOG, ACTION_LABELS } from '@/shared/constants';

@Component({
  selector: 'organisms-task-list',
  templateUrl: './organisms-task-list.component.html',
  styleUrls: ['./organisms-task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskListComponent implements OnInit, OnDestroy {
  @Input() tasks: Task[];
  @Input() priorities: TaskPriority[];

  @ViewChild(MatAccordion) taskAccordion: MatAccordion;

  actionLabels = ACTION_LABELS;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store: Store<AppState>,
    public dialog: MatDialog,
    private mediaQuery: MediaqueryService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(taskListRequested());
    this.store.dispatch(taskPrioritiesRequested());
  }

  openTaskDialog(taskToUpdate?: Task): void {
    const data: TaskDialogData = {
      priorities: this.priorities
    } as TaskDialogData;
    taskToUpdate ? ((data.title = 'Update task'), (data.task = taskToUpdate)) : (data.title = 'Add new task');

    const dialogRef = this.dialog.open(OrganismsTaskDialogComponent, {
      ...this.mediaQuery.smallPopupSize,
      data
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((task) => {
        if (task) {
          if (taskToUpdate) {
            this.store.dispatch(updateTaskRequested({ task }));
          } else {
            this.store.dispatch(createTask({ task }));
          }
        }
      });
  }

  deleteTask(id: number): void {
    this.store.dispatch(deleteTask({ id }));
  }

  deleteMultipleTask(): void {
    this.toastMessageService
      .confirm(DIALOG.CONFIRM, 'Do you really want to delete all comleted tasks?')
      .then((result) => {
        if (result.value) {
          const taskIds: number[] = this.tasks.filter((task) => task.isCompleted).map((task) => task.id);
          this.store.dispatch(deleteMultipleTaskRequested({ taskIds }));
        }
      });
  }

  changeTaskStatus(event: MatCheckboxChange, task: Task): void {
    this.store.dispatch(updateTaskRequested({ task: { ...task, isCompleted: event.checked } }));
  }

  getTaskClass(task: Task): string {
    return `task-priority-${task?.TaskPriority?.value}`;
  }

  get completedTasksLength(): boolean {
    return this.tasks?.length ? this.tasks.filter((task) => task.isCompleted).length > 0 : true;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
