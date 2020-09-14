import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';

@Component({
  templateUrl: 'add-privilege-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPrivilegeDialogComponent implements OnInit {
  privilegeGroup: FormGroup;
  actionLabels = ACTION_LABELS;
  themePalette = THEME_PALETTE;

  constructor(public dialogRef: MatDialogRef<AddPrivilegeDialogComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildPrivilegeFormGroup();
  }

  buildPrivilegeFormGroup(): void {
    this.privilegeGroup = this.fb.group({
      keyString: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      title: new FormControl(null, [Validators.required, Validators.minLength(4)])
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    this.dialogRef.close(this.privilegeGroup.value);
  }
}
