import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogCreateEditPageModel } from '@/shared/components';
import { DialogCreateEditModel, DialogDataModel, DialogResultModel } from '@/shared/models';
import { TaskDialogData } from '@/modules/task-manager/models';

@Component({
  selector: 'organisms-task-dialog',
  templateUrl: './organisms-task-dialog.component.html',
  styleUrls: ['./organisms-task-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganismsTaskDialogComponent<TDialogModel extends DialogCreateEditModel, TModel extends TaskDialogData>
  extends DialogCreateEditPageModel<TDialogModel, TModel>
  implements OnInit {
  taskData: FormGroup;
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<TModel>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<TDialogModel, TModel>,
    private fb: FormBuilder
  ) {
    super(dialogRef, data);
  }

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
    if (!this.isCreateMode) {
      this.taskData.patchValue(this.model.task);
    }
  }

  onClose(result: boolean): void {
    this.dialogRef.close(new DialogResultModel(result, this.taskData.value));
  }
}
