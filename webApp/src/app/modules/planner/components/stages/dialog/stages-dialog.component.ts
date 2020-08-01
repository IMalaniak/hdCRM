import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StagesComponent } from '../list/stages.component';
import { Stage } from '@/modules/planner/models';

export interface StagesDialogData {
  title: string;
}
@Component({
  templateUrl: 'stages-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StagesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StagesDialogData
  ) {}

  @ViewChild(StagesComponent, { static: true })
  stagesComponent: StagesComponent;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmiteClick(stages: Stage[]): void {
    this.dialogRef.close(stages);
  }
}
