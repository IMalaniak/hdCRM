import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: 'add-privilege-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPrivilegeDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddPrivilegeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormGroup
  ) {}

  get title() {
    return this.data.get('title');
  }

  get keyString() {
    return this.data.get('keyString');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
