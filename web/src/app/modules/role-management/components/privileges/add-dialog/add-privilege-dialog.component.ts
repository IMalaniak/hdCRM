import { ComponentType } from '@angular/cdk/portal';
import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Privilege } from '@core/modules/role-api/shared';
import { DialogCreateEditPageModel } from '@shared/components';
import { ACTION_LABEL, THEME_PALETTE } from '@shared/constants';
import { DialogCreateEditModel, IDialogResult } from '@shared/models';
import { DialogDataModel } from '@shared/models/dialog/dialog-data.model';

@Component({
  templateUrl: 'add-privilege-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPrivilegeDialogComponent extends DialogCreateEditPageModel implements OnInit {
  privilegeGroup: FormGroup;
  actionLabels = ACTION_LABEL;
  themePalette = THEME_PALETTE;

  constructor(
    readonly dialogRef: MatDialogRef<ComponentType<unknown>>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogDataModel<DialogCreateEditModel>,
    private fb: FormBuilder
  ) {
    super(dialogRef, data);
  }

  ngOnInit(): void {
    this.buildPrivilegeFormGroup();
  }

  buildPrivilegeFormGroup(): void {
    this.privilegeGroup = this.fb.group({
      keyString: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      title: new FormControl(null, [Validators.required, Validators.minLength(4)])
    });
  }

  onClose(success: boolean): void {
    const result: IDialogResult<Privilege> = {
      success,
      data: this.privilegeGroup.value
    };
    this.dialogRef.close(result);
  }
}
