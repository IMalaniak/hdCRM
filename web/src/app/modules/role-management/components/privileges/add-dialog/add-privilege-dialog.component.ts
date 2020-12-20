import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ComponentType } from '@angular/cdk/portal';

import { Privilege } from '@/core/modules/role-api/shared';
import { ACTION_LABELS, THEME_PALETTE } from '@/shared/constants';
import { DialogDataModel } from '@/shared/models/dialog/dialog-data.model';
import { DialogCreateEditModel, DialogResultModel } from '@/shared/models';
import { DialogCreateEditPageModel } from '@/shared/components';

@Component({
  templateUrl: 'add-privilege-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPrivilegeDialogComponent extends DialogCreateEditPageModel implements OnInit {
  privilegeGroup: FormGroup;
  actionLabels = ACTION_LABELS;
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
    const result: DialogResultModel<Privilege> = {
      success,
      model: this.privilegeGroup.value
    };
    this.dialogRef.close(result);
  }
}
