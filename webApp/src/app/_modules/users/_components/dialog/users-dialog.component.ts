import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersComponent } from '../list/users.component';

export interface UsersDialogData {
  title: string;
}
@Component({
  templateUrl: 'users-dialog.component.html',
})
export class UsersDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsersDialogData
  ) {}

  @ViewChild(UsersComponent, {static: true})
    usersComponent: UsersComponent;

  onNoClick(): void {
    this.dialogRef.close();
  }

}