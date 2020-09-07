import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

export interface CreateChatDialogData {
  header: string;
  title: FormControl;
}

@Component({
  templateUrl: 'create-chat-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateChatDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateChatDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(title: string): void {
    this.dialogRef.close(title);
  }
}
