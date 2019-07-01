import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolesComponent } from '../list/roles.component';

export interface RolesDialogData {
  title: string;
}
@Component({
  templateUrl: 'roles-dialog.component.html',
})
export class RolesDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RolesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RolesDialogData
  ) {}

  @ViewChild(RolesComponent, {static: true})
    rolesComponent: RolesComponent;

  onNoClick(): void {
    this.dialogRef.close();
  }

}
