import { Component, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrivilegesComponent } from '../list/privileges.component';
import { ACTION_LABELS } from '@/shared/constants';

export interface PrivilegesDialogData {
  title: string;
}

@Component({
  templateUrl: 'privileges-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivilegesDialogComponent {
  actionLabels = ACTION_LABELS;

  constructor(
    public dialogRef: MatDialogRef<PrivilegesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrivilegesDialogData
  ) {}

  @ViewChild(PrivilegesComponent, { static: true })
  privilegesComponent: PrivilegesComponent;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    this.dialogRef.close(this.privilegesComponent.selection.selected);
  }
}
