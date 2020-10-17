import { Component, OnDestroy, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatAccordion } from '@angular/material/expansion';

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
import { OrganismsTaskDialogComponent } from '../organisms-task-dialog/organisms-task-dialog.component';
import { DIALOG, ACTION_LABELS, MAT_BUTTON, THEME_PALETTE, CONSTANTS } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/modal/dialog-confirm.model';
import { DialogDataModel } from '@/shared/models/modal/dialog-data.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/core/services/dialog/dialog.service';
import { DialogCreateEditModel, DialogMode, DialogType, DialogResultModel } from '@/shared/models';
import { DialogSizeService } from '@/shared/services';

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
  themePalette = THEME_PALETTE;
  matButtonType = MAT_BUTTON;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private store$: Store<AppState>,
    private dialogService: DialogService,
    private dialogSizeService: DialogSizeService
  ) { }

  get completedTasksLength(): boolean {
    return this.tasks?.length ? this.tasks.filter((task) => task.isCompleted).length > 0 : true;
  }

  ngOnInit(): void {
    this.store$.dispatch(taskListRequested());
    this.store$.dispatch(taskPrioritiesRequested());
  }

  openTaskDialog(taskToUpdate?: Task): void {
    const dialogModel: DialogCreateEditModel = new DialogCreateEditModel(
      taskToUpdate ? DialogMode.EDIT : DialogMode.CREATE,
      taskToUpdate ? CONSTANTS.TEXTS_UPDATE_TASK : CONSTANTS.TEXTS_CREATE_TASK,
      taskToUpdate ? DIALOG.SAVE : DIALOG.CREATE
    );
    const model: TaskDialogData = new TaskDialogData(this.priorities, taskToUpdate);
    const dialogDataModel = new DialogDataModel(dialogModel, model);

    this.dialogService
      .open(OrganismsTaskDialogComponent, dialogDataModel, this.dialogSizeService.getSize(DialogType.STANDART))
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: DialogResultModel<Task>) => {
        if (result && result.succession) {
          if (taskToUpdate) {
            this.store$.dispatch(updateTaskRequested({ task: result.model }));
          } else {
            this.store$.dispatch(createTask({ task: result.model }));
          }
        }
      });
  }

  protected deleteTask(id: number): void {
    this.store$.dispatch(deleteTask({ id }));
  }

  deleteMultipleTask(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_TASKS_COMPLETED_CONFIRM);
    const dialogDataModel = new DialogDataModel(dialogModel);

    this.dialogService
      .confirm(DialogConfirmComponent, dialogDataModel, () => {
        const taskIds: number[] = this.tasks.filter((task) => task.isCompleted).map((task) => task.id);
        this.store$.dispatch(deleteMultipleTaskRequested({ taskIds }));
      });
  }

  changeTaskStatus(event: MatCheckboxChange, task: Task): void {
    this.store$.dispatch(updateTaskRequested({ task: { ...task, isCompleted: event.checked } }));
  }

  getTaskClass(task: Task): string {
    return `task-priority-${task?.TaskPriority?.value}`;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
