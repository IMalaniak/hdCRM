import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDialogData } from '@/modules/task-manager/models';

@Component({
  selector: 'organisms-task-dialog',
  templateUrl: './organisms-task-dialog.component.html',
  styleUrls: ['./organisms-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskDialogComponent implements OnInit {
  taskData: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OrganismsTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildTaskForm();
    this.setDataIfTaskExist();
  }

  buildTaskForm(): void {
    this.taskData = this.fb.group({
      id: new FormControl(null),
      title: new FormControl(null, [Validators.required, Validators.maxLength(75)]),
      description: new FormControl(null, Validators.maxLength(255)),
      TaskPriorityId: new FormControl(null, Validators.required)
    });
  }

  setDataIfTaskExist(): void {
    if (this.data.task) {
      this.taskData.patchValue(this.data.task);
    }
  }

  onSubmit(): void {
    this.dialogRef.close({ ...this.taskData.value });
  }
}
