import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Task } from '../../models';
import { isEmpty } from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface TaskDialogData {
  title: string;
  task: Task;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {
  taskData: FormGroup;
  task: Task;

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildTaskForm();
    this.setDataIfTaskExist();
  }

  buildTaskForm(): void {
    this.taskData = this.fb.group({
      title: new FormControl(null, [Validators.required, Validators.maxLength(75)]),
      description: new FormControl(null, Validators.maxLength(100)),
      isCompleted: new FormControl(null),
      priority: new FormControl(null, Validators.required)
    });
  }

  setDataIfTaskExist(): void {
    if (!isEmpty(this.data.task)) {
      this.taskData.addControl('id', new FormControl(null));
      this.taskData.addControl('CreatorId', new FormControl(null));

      for (let formKey of Object.keys(this.taskData.value)) {
        for (let taskKey of Object.keys(this.data.task)) {
          if (formKey === taskKey) {
            this.taskData.patchValue({ ...this.taskData, [formKey]: this.data.task[taskKey] });
          }
        }
      }
    }
  }

  get title(): string {
    return this.data.title;
  }

  onSubmit(): void {
    this.taskData.get('priority').patchValue(+this.taskData.get('priority').value);
    if (!isEmpty(this.data.task)) {
      this.dialogRef.close({ ...this.taskData.value });
    } else {
      this.taskData.get('isCompleted').patchValue(false);
      this.dialogRef.close({ ...this.taskData.value });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
