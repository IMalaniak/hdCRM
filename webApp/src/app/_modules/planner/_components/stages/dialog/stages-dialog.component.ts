import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StagesComponent } from '../list/stages.component';

export interface StagesDialogData {
  title: string;
}
@Component({
  templateUrl: 'stages-dialog.component.html'
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
}
