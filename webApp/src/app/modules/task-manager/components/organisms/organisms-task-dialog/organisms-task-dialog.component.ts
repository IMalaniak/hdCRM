import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskPriority, TaskDialogData } from '@/modules/task-manager/models';

@Component({
  selector: 'organisms-task-dialog',
  templateUrl: './organisms-task-dialog.component.html',
  styleUrls: ['./organisms-task-dialog.component.scss']
})
export class OrganismsTaskDialogComponent implements OnInit {
  taskData: FormGroup;

  //TODO @ArseniiIrod create logic on BE side, and recieve data from API
  priorityValues: TaskPriority[] = [
    { label: 'Not urgent or important', value: 1 },
    { label: 'Urgent not important', value: 2 },
    { label: 'Important not urgent', value: 3 },
    { label: 'Urgent and important', value: 4 }
  ];

  constructor(
    public dialogRef: MatDialogRef<OrganismsTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildTaskForm();
    this.setDataIfTaskExist();
  }

  buildTaskForm(): void {
    this.taskData = this.fb.group({
      id: new FormControl(null),
      title: new FormControl(null, [Validators.required, Validators.maxLength(75)]),
      description: new FormControl(null, Validators.maxLength(255)),
      priority: new FormControl(null, Validators.required)
    });
  }

  setDataIfTaskExist(): void {
    if (this.data.task) {
      this.taskData.patchValue(this.data.task);
    }
  }

  get title(): string {
    return this.data.title;
  }

  onSubmit(): void {
    this.dialogRef.close({ ...this.taskData.value });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
