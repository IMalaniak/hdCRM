import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

export interface CreateChatDialogData {
  header: string;
  title: FormControl;
}

@Component({
  templateUrl: 'create-chat-dialog.component.html'
})
export class CreateChatDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateChatDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
