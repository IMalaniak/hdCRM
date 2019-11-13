import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PrivilegesComponent } from '../list/privileges.component';

export interface PrivilegesDialogData {
  title: string;
}
@Component({
  templateUrl: 'privileges-dialog.component.html'
})
export class PrivilegesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PrivilegesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrivilegesDialogData
  ) {}

  @ViewChild(PrivilegesComponent, { static: true })
  privilegesComponent: PrivilegesComponent;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
