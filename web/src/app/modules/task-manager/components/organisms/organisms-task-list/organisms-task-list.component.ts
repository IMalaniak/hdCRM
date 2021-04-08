import { Component, OnDestroy, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatAccordion } from '@angular/material/expansion';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppState } from '@/core/store';
import { DIALOG, ACTION_LABEL, MAT_BUTTON, THEME_PALETTE, CONSTANTS, BS_ICON } from '@/shared/constants';
import { DialogConfirmModel } from '@/shared/models/dialog/dialog-confirm.model';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogConfirmComponent } from '@/shared/components/dialogs/dialog-confirm/dialog-confirm.component';
import { DialogService } from '@/shared/services';
import { DialogCreateEditModel, DialogMode, DialogType, IDialogResult } from '@/shared/models';
import {
  deleteTask,
  createTask,
  taskListRequested,
  updateTaskRequested,
  deleteMultipleTaskRequested
} from '../../../store/task.actions';
import { OrganismsTaskDialogComponent } from '../organisms-task-dialog/organisms-task-dialog.component';
import { Task } from '../../../models';

@Component({
  selector: 'organisms-task-list',
  templateUrl: './organisms-task-list.component.html',
  styleUrls: ['./organisms-task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskListComponent implements OnInit, OnDestroy {
  @Input() tasks: Task[];

  @ViewChild(MatAccordion) taskAccordion: MatAccordion;

  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;
  matButtonType = MAT_BUTTON;
  listIcons: { [key: string]: BS_ICON } = {
    matMenu: BS_ICON.ThreeDotsVertical,
    delete: BS_ICON.Trash,
    edit: BS_ICON.Pencil,
    add: BS_ICON.Plus,
    collapse: BS_ICON.ArrowsCollapse,
    expand: BS_ICON.ArrowsExpand,
    flag: BS_ICON.Flag
  };

  private unsubscribe: Subject<void> = new Subject();

  constructor(private store$: Store<AppState>, private dialogService: DialogService) {}

  get completedTasksLength(): boolean {
    return this.tasks?.length ? this.tasks.filter((task) => task.isCompleted).length > 0 : true;
  }

  ngOnInit(): void {
    this.store$.dispatch(taskListRequested());
  }

  openTaskDialog(taskToUpdate?: Task): void {
    const dialogModel: DialogCreateEditModel = new DialogCreateEditModel(
      taskToUpdate ? DialogMode.EDIT : DialogMode.CREATE,
      taskToUpdate ? CONSTANTS.TEXTS_UPDATE_TASK : CONSTANTS.TEXTS_CREATE_TASK,
      taskToUpdate ? DIALOG.SAVE : DIALOG.CREATE
    );
    const dialogDataModel: DialogDataModel<DialogCreateEditModel> = { dialogModel, model: taskToUpdate };

    this.dialogService
      .open(OrganismsTaskDialogComponent, dialogDataModel, DialogType.STANDART)
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: IDialogResult<Task>) => {
        if (result && result.success) {
          if (taskToUpdate) {
            this.store$.dispatch(updateTaskRequested({ task: result.data }));
          } else {
            this.store$.dispatch(createTask({ task: result.data }));
          }
        }
      });
  }

  protected deleteTask(id: number): void {
    this.store$.dispatch(deleteTask({ id }));
  }

  deleteMultipleTask(): void {
    const dialogModel: DialogConfirmModel = new DialogConfirmModel(CONSTANTS.TEXTS_DELETE_TASKS_COMPLETED_CONFIRM);
    const dialogDataModel: DialogDataModel<DialogConfirmModel> = { dialogModel };

    this.dialogService.confirm(DialogConfirmComponent, dialogDataModel, () => {
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
