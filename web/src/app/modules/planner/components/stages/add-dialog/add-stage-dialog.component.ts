import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ACTION_LABELS } from '@/shared/constants';

export interface AddStageDialogData {
  keyString: FormControl;
}

@Component({
  templateUrl: 'add-stage-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStageDialogComponent {
  actionLabels = ACTION_LABELS;

  constructor(
    public dialogRef: MatDialogRef<AddStageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddStageDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddStage(): void {
    this.dialogRef.close(this.data.keyString.value);
  }
}
