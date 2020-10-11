import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '@/core/reducers';
import { selectFormByName } from '@/core/reducers/dynamic-form/dynamic-form.selectors';
import { formRequested } from '@/core/reducers/dynamic-form/dynamic-form.actions';
import { DynamicForm } from '@/shared/models';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { Task, TaskDialogData } from '@/modules/task-manager/models';

@Component({
  selector: 'organisms-task-dialog',
  templateUrl: './organisms-task-dialog.component.html',
  styleUrls: ['./organisms-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskDialogComponent implements OnInit {
  taskFormJson$: Observable<DynamicForm> = this.store$.pipe(select(selectFormByName('task')));

  taskFormValues: Task;

  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    private store$: Store<AppState>,
    public dialogRef: MatDialogRef<OrganismsTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(formRequested({ formName: 'task' }));
  }

  taskFormValueChanges(formVal: Task): void {
    this.taskFormValues = { ...this.taskFormValues, ...formVal };
  }

  onSubmit(): void {
    this.dialogRef.close({ ...this.data.task, ...this.taskFormValues });
  }
}
